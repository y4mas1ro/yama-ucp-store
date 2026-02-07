import { z } from "zod";
import { apiCall, buyerInfo, setBuyerInfo, lastCheckoutSessionId, setLastCheckoutSessionId } from "../state";

export const registerCheckoutTools = (server: any) => {
    server.tool(
        "set_shipping_address",
        {
            firstName: z.string().describe("Given name"),
            lastName: z.string().describe("Family name"),
            addressLine1: z.string().describe("Address line 1 (Street, Building)"),
            locality: z.string().describe("Locality (City/Town)"),
            administrativeArea: z.string().describe("Administrative area (Prefecture)"),
            postalCode: z.string().describe("Postal code"),
            countryCode: z.string().default("JP").describe("Country code (ISO 3166-1 alpha-2)")
        },
        async (args: any) => {
            setBuyerInfo({
                name: { given_name: args.firstName, family_name: args.lastName },
                shipping_address: {
                    address_line_1: args.addressLine1,
                    locality: args.locality,
                    administrative_area: args.administrativeArea,
                    postal_code: args.postalCode,
                    country_code: args.countryCode
                }
            });
            return {
                content: [{ type: "text", text: "Shipping address updated." }],
            };
        }
    );

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
                    buyer: buyerInfo,
                    currency: 'JPY',
                    payment: {
                        methods: [{ type: 'card', provider: 'stripe' }]
                    }
                })
            });

            setLastCheckoutSessionId(session.id);

            return {
                content: [{
                    type: "text",
                    text: `Checkout session created (ID: ${session.id}). Shipping to: ${buyerInfo.name.family_name} ${buyerInfo.name.given_name}. Total: ${session.totals.find((t: any) => t.type === 'total')?.amount.value} ${session.currency}. You can now proceed to 'complete_purchase'.`
                }],
            };
        }
    );

    server.tool(
        "complete_purchase",
        {},
        async () => {
            if (!lastCheckoutSessionId) {
                throw new Error("No active checkout session. Please call 'prepare_checkout' first.");
            }

            const result = await apiCall(`/ucp/checkout-sessions/${lastCheckoutSessionId}/complete`, {
                method: "POST"
            });

            setLastCheckoutSessionId(null);
            return {
                content: [{
                    type: "text",
                    text: `Purchase completed successfully! Order ID: ${result.order?.order_id}. Order Number: ${result.order?.order_number}`
                }],
            };
        }
    );
};
