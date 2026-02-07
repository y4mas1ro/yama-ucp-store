"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyerInfo = exports.lastCheckoutSessionId = exports.sessionToken = exports.BACKEND_URL = void 0;
exports.setSessionToken = setSessionToken;
exports.setLastCheckoutSessionId = setLastCheckoutSessionId;
exports.setBuyerInfo = setBuyerInfo;
exports.apiCall = apiCall;
const node_fetch_1 = __importDefault(require("node-fetch"));
// Configuration
exports.BACKEND_URL = process.env.BACKEND_URL || "https://yama-ucp-store-backend.vercel.app";
// State Management (In-memory for local/Docker session)
exports.sessionToken = null;
exports.lastCheckoutSessionId = null;
exports.buyerInfo = {
    name: { given_name: "", family_name: "" },
    shipping_address: {
        address_line_1: "",
        locality: "",
        administrative_area: "",
        postal_code: "",
        country_code: "JP"
    }
};
function setSessionToken(token) {
    exports.sessionToken = token;
}
function setLastCheckoutSessionId(id) {
    exports.lastCheckoutSessionId = id;
}
function setBuyerInfo(info) {
    exports.buyerInfo = info;
}
// Helper for Backend API calls
async function apiCall(path, options = {}) {
    if (!exports.sessionToken && !path.includes("/auth/login")) {
        throw new Error("Unauthorized: Please login first using the 'login' tool.");
    }
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };
    if (exports.sessionToken) {
        headers["Authorization"] = `Bearer ${exports.sessionToken}`;
    }
    const response = await (0, node_fetch_1.default)(`${exports.BACKEND_URL}/api${path}`, {
        ...options,
        headers
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error: ${error}`);
    }
    return response.json();
}
