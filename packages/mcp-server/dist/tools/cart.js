"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCartTools = void 0;
const zod_1 = require("zod");
const state_1 = require("../state");
const registerCartTools = (server) => {
    server.tool("add_to_cart", {
        productId: zod_1.z.string().describe("The ID of the product to add"),
        quantity: zod_1.z.number().default(1).describe("Quantity to add")
    }, async ({ productId, quantity }) => {
        // Fetch product details from backend
        const product = await (0, state_1.apiCall)(`/products/${productId}`);
        if (!product) {
            return { content: [{ type: "text", text: "Product not found" }] };
        }
        await (0, state_1.apiCall)("/cart", {
            method: "POST",
            body: JSON.stringify({ ...product, quantity })
        });
        return {
            content: [{ type: "text", text: `Successfully added ${quantity} x ${product.title} to cart.` }],
        };
    });
    server.tool("view_cart", {}, async () => {
        const items = await (0, state_1.apiCall)("/cart");
        return {
            content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
        };
    });
};
exports.registerCartTools = registerCartTools;
