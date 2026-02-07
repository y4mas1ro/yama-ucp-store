import { z } from "zod";
import { apiCall } from "../state";

export const registerProductTools = (server: any) => {
    server.tool(
        "search_products",
        { query: z.string().optional().describe("Search keyword for products (optional)") },
        async ({ query }: any) => {
            const url = query ? `/products?q=${encodeURIComponent(query)}` : '/products';
            const products = await apiCall(url);
            return {
                content: [{ type: "text", text: JSON.stringify(products, null, 2) }],
            };
        }
    );
};
