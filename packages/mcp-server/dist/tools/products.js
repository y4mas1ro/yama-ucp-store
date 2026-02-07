"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProductTools = void 0;
const zod_1 = require("zod");
const state_1 = require("../state");
const registerProductTools = (server) => {
    server.tool("search_products", { query: zod_1.z.string().optional().describe("Search keyword for products (optional)") }, async ({ query }) => {
        const url = query ? `/products?q=${encodeURIComponent(query)}` : '/products';
        const products = await (0, state_1.apiCall)(url);
        return {
            content: [{ type: "text", text: JSON.stringify(products, null, 2) }],
        };
    });
};
exports.registerProductTools = registerProductTools;
