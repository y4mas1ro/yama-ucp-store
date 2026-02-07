"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCheckoutTools = void 0;
const zod_1 = require("zod");
const state_1 = require("../state");
const registerCheckoutTools = (server) => {
    server.tool("set_shipping_address", {
        firstName: zod_1.z.string().describe("Given name"),
        lastName: zod_1.z.string().describe("Family name"),
        addressLine1: zod_1.z.string().describe("Address line 1 (Street, Building)"),
        locality: zod_1.z.string().describe("Locality (City/Town)"),
        administrativeArea: zod_1.z.string().describe("Administrative area (Prefecture)"),
        postalCode: zod_1.z.string().describe("Postal code"),
        countryCode: zod_1.z.string().default("JP").describe("Country code (ISO 3166-1 alpha-2)")
    }, async (args) => {
        (0, state_1.setBuyerInfo)({
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
    });
    server.tool("prepare_checkout", {}, async () => {
        const cartItems = await (0, state_1.apiCall)("/cart");
        if (cartItems.length === 0)
            return { content: [{ type: "text", text: "Cart is empty" }] };
        const session = await (0, state_1.apiCall)("/ucp/checkout-sessions", {
            method: "POST",
            body: JSON.stringify({
                line_items: cartItems.map((item) => ({
                    offer_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price,
                    title: item.title,
                })),
                buyer: state_1.buyerInfo,
                currency: 'JPY',
                payment: {
                    methods: [{ type: 'card', provider: 'stripe' }]
                }
            })
        });
        (0, state_1.setLastCheckoutSessionId)(session.id);
        return {
            content: [{
                    type: "text",
                    text: `Checkout session created (ID: ${session.id}). Shipping to: ${state_1.buyerInfo.name.family_name} ${state_1.buyerInfo.name.given_name}. Total: ${session.totals.find((t) => t.type === 'total')?.amount.value} ${session.currency}. You can now proceed to 'complete_purchase'.`
                }],
        };
    });
    server.tool("complete_purchase", {}, async () => {
        if (!state_1.lastCheckoutSessionId) {
            throw new Error("No active checkout session. Please call 'prepare_checkout' first.");
        }
        const result = await (0, state_1.apiCall)(`/ucp/checkout-sessions/${state_1.lastCheckoutSessionId}/complete`, {
            method: "POST"
        });
        (0, state_1.setLastCheckoutSessionId)(null);
        return {
            content: [{
                    type: "text",
                    text: `Purchase completed successfully! Order ID: ${result.order?.order_id}. Order Number: ${result.order?.order_number}`
                }],
        };
    });
};
exports.registerCheckoutTools = registerCheckoutTools;
