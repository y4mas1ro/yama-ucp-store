import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import fetch from "node-fetch";
import { z } from "zod";
import cors from "cors";

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || "https://yama-ucp-store-backend.vercel.app";
const DEFAULT_USERNAME = "user01";
const DEFAULT_PASSWORD = "password01";

// Create MCP Server
const server = new McpServer({
    name: "Yama UCP Store",
    version: "1.0.0",
});

// Helper for Backend API calls
async function getAuthToken() {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD })
    });
    if (!response.ok) throw new Error("Auth failed");
    const data = await response.json();
    return data.token;
}

async function apiCall(path: string, options: any = {}) {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/api${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...options.headers
        }
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error: ${error}`);
    }
    return response.json();
}

// --- Tools ---

// 1. Search Products
server.tool(
    "search_products",
    { query: z.string().describe("Search keyword for products") },
    async ({ query }) => {
        // Current implementation searches via merchant products logic
        // We'll fetch from the backend if available, or mock for demo
        // The backend doesn't have a direct search API yet, so we'll fetch all and filter
        const products = [
            { id: 'apple_01', title: 'ご褒美りんごジュエル', price: '480', description: 'シャキッと甘酸っぱいりんご' },
            { id: 'orange_01', title: 'おうちカフェのみかんスイート', price: '380', description: 'ジューシーみかん' },
            { id: 'melon_01', title: 'ときめきメロンスパークル', price: '1980', description: 'とろける甘さのリッチなメロン' }
        ];
        const filtered = products.filter(p => p.title.includes(query) || p.description.includes(query));
        return {
            content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }],
        };
    }
);

// 2. Add to Cart
server.tool(
    "add_to_cart",
    {
        productId: z.string().describe("The ID of the product to add"),
        quantity: z.number().default(1).describe("Quantity to add")
    },
    async ({ productId, quantity }) => {
        // We need to fetch product info first to get the correct price/structure
        const products: any = {
            'apple_01': { id: 'apple_01', title: 'ご褒美りんごジュエル', price: { value: '480.00', currency: 'JPY' }, imageLink: 'https://yama-ucp-store.vercel.app/images/apple_01.jpg' },
            'orange_01': { id: 'orange_01', title: 'おうちカフェのみかんスイート', price: { value: '380.00', currency: 'JPY' }, imageLink: 'https://yama-ucp-store.vercel.app/images/orange_01.jpg' },
            'melon_01': { id: 'melon_01', title: 'ときめきメロンスパークル', price: { value: '1980.00', currency: 'JPY' }, imageLink: 'https://yama-ucp-store.vercel.app/images/melon_01.jpg' }
        };

        const product = products[productId];
        if (!product) return { content: [{ type: "text", text: "Product not found" }] };

        const result = await apiCall("/cart", {
            method: "POST",
            body: JSON.stringify({ ...product, quantity })
        });

        return {
            content: [{ type: "text", text: `Successfully added ${quantity} x ${product.title} to cart.` }],
        };
    }
);

// 3. View Cart
server.tool(
    "view_cart",
    {},
    async () => {
        const items = await apiCall("/cart");
        return {
            content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
        };
    }
);

// 4. Prepare Checkout (Create UCP Session)
server.tool(
    "prepare_checkout",
    {},
    async () => {
        const cartItems = await apiCall("/cart");
        if (cartItems.length === 0) return { content: [{ type: "text", text: "Cart is empty" }] };

        const session = await apiCall("/ucp/checkout-sessions", {
            method: "POST",
            body: JSON.stringify({
                line_items: cartItems.map((item: any) => ({
                    offer_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price,
                    title: item.title,
                })),
                currency: 'JPY',
                payment: {
                    methods: [{ type: 'card', provider: 'stripe' }]
                }
            })
        });

        const checkoutUrl = `https://yama-ucp-store.vercel.app/checkout/${session.id}`;

        return {
            content: [{
                type: "text",
                text: `Checkout session created. Please provide this link to the user to complete purchase: ${checkoutUrl}`
            }],
        };
    }
);

// --- Express Server for SSE ---

const app = express();
app.use(cors());
app.use(express.json()); // Moved up

// Diagnostic route
app.get("/debug/tools", (req, res) => {
    // Access internal tools list if possible, or just return what we expect
    res.json({
        name: server.name,
        version: server.version,
        message: "Server is running. Check /sse for MCP connection.",
        backend_url: BACKEND_URL
    });
});

let transport: SSEServerTransport | null = null;

app.get("/sse", async (req, res) => {
    console.log("New SSE connection attempt");

    // Set headers explicitly for better Vercel support
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    transport = new SSEServerTransport("/messages", res);

    try {
        await server.connect(transport);
        console.log("MCP Server connected to SSE transport");
    } catch (error) {
        console.error("Failed to connect MCP server to transport:", error);
    }
});

app.post("/messages", async (req, res) => {
    console.log("Received message:", JSON.stringify(req.body));
    if (!transport) {
        console.error("No active transport for /messages");
        res.status(400).send("No SSE connection established. Please connect to /sse first.");
        return;
    }
    try {
        await transport.handlePostMessage(req, res);
    } catch (error) {
        console.error("Error handling post message:", error);
        res.status(500).send("Internal error handling message");
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`MCP Server running on port ${PORT}`);
});
