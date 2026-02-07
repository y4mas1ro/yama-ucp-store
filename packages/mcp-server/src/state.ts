import fetch from "node-fetch";

// Configuration
export const BACKEND_URL = process.env.BACKEND_URL || "https://yama-ucp-store-backend.vercel.app";

// State Management (In-memory for local/Docker session)
export let sessionToken: string | null = null;
export let lastCheckoutSessionId: string | null = null;
export let buyerInfo: any = {
    name: { given_name: "", family_name: "" },
    shipping_address: {
        address_line_1: "",
        locality: "",
        administrative_area: "",
        postal_code: "",
        country_code: "JP"
    }
};

export function setSessionToken(token: string | null) {
    sessionToken = token;
}

export function setLastCheckoutSessionId(id: string | null) {
    lastCheckoutSessionId = id;
}

export function setBuyerInfo(info: any) {
    buyerInfo = info;
}

// Helper for Backend API calls
export async function apiCall(path: string, options: any = {}) {
    if (!sessionToken && !path.includes("/auth/login")) {
        throw new Error("Unauthorized: Please login first using the 'login' tool.");
    }

    const headers: any = {
        "Content-Type": "application/json",
        ...options.headers
    };

    if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
    }

    const response = await fetch(`${BACKEND_URL}/api${path}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error: ${error}`);
    }
    return response.json();
}
