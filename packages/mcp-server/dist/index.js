"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const state_1 = require("./state");
const tools_1 = require("./tools");
const TRANSPORT = process.env.TRANSPORT || "sse"; // "sse" or "stdio"
// Create MCP Server
const server = new mcp_js_1.McpServer({
    name: "Yama UCP Store",
    version: "1.0.0",
});
// Register all modular tools
(0, tools_1.registerAllTools)(server);
// --- Transport Initialization ---
if (TRANSPORT === "stdio") {
    // Stdio Transport (Best for Local Docker/Claude Desktop)
    const transport = new stdio_js_1.StdioServerTransport();
    server.connect(transport).then(() => {
        console.error("MCP Server connected via Stdio");
    }).catch(error => {
        console.error("Failed to connect Stdio transport:", error);
    });
}
else {
    // SSE Transport (Original Express server logic)
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // Diagnostic route
    app.get("/debug/tools", (req, res) => {
        res.json({
            name: "Yama UCP Store",
            version: "1.0.0",
            message: "Server is running.",
            backend_url: state_1.BACKEND_URL,
            timestamp: new Date().toISOString()
        });
    });
    let transport = null;
    app.get("/sse", async (req, res) => {
        console.error("SSE: New connection attempt");
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        transport = new sse_js_1.SSEServerTransport("/messages", res);
        try {
            await server.connect(transport);
            console.error("SSE: MCP Server connected to transport");
            req.on('close', () => {
                console.error("SSE: Connection closed by client");
                transport = null;
            });
        }
        catch (error) {
            console.error("SSE: Connection error:", error);
        }
    });
    app.post("/messages", async (req, res) => {
        if (!transport) {
            res.status(400).json({ error: "No active SSE session" });
            return;
        }
        try {
            await transport.handlePostMessage(req, res);
        }
        catch (error) {
            console.error("Messages: Error handling message:", error);
            res.status(500).send(error instanceof Error ? error.message : "Internal error");
        }
    });
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
        console.error(`MCP Server (SSE) running on port ${PORT}`);
    });
}
