import { z } from "zod";
import { apiCall } from "../state";

export const registerCartTools = (server: any) => {
    server.tool(
        "add_to_cart",
        {
            productId: z.string().describe("The ID of the product to add"),
            quantity: z.number().default(1).describe("Quantity to add")
        },
        async ({ productId, quantity }: any) => {
            // Fetch product details from backend
            const product = await apiCall(`/products/${productId}`);

            if (!product) {
                return { content: [{ type: "text", text: "Product not found" }] };
            }

            await apiCall("/cart", {
                method: "POST",
                body: JSON.stringify({ ...product, quantity })
            });

            return {
                content: [{ type: "text", text: `Successfully added ${quantity} x ${product.title} to cart.` }],
            };
        }
    );

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
};
