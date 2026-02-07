"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAuthTools = void 0;
const zod_1 = require("zod");
const state_1 = require("../state");
const registerAuthTools = (server) => {
    server.tool("login", {
        username: zod_1.z.string().describe("Username"),
        password: zod_1.z.string().describe("Password")
    }, async ({ username, password }) => {
        const data = await (0, state_1.apiCall)("/auth/login", {
            method: "POST",
            body: JSON.stringify({ username, password })
        });
        (0, state_1.setSessionToken)(data.token);
        return {
            content: [{ type: "text", text: `Successfully logged in as ${username}. Session token stored.` }],
        };
    });
};
exports.registerAuthTools = registerAuthTools;
