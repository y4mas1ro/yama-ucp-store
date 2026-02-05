// packages/frontend/src/lib/api.ts

const API_BASE = 'http://localhost:3001/api';

export async function apiFetch(path: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('yama_token') : null;

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
    if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
    }
    return res.json();
}

export const cartApi = {
    get: () => apiFetch('/cart'),
    add: (item: any) => apiFetch('/cart', { method: 'POST', body: JSON.stringify(item) }),
    remove: (id: string) => apiFetch(`/cart/${id}`, { method: 'DELETE' }),
    clear: () => apiFetch('/cart/clear', { method: 'POST' }),
};

export const ucpApi = {
    createSession: (data: any) => apiFetch('/ucp/checkout-sessions', { method: 'POST', body: JSON.stringify(data) }),
    getSession: (id: string) => apiFetch(`/ucp/checkout-sessions/${id}`),
    updateSession: (id: string, updates: any) => apiFetch(`/ucp/checkout-sessions/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
    completeSession: (id: string) => apiFetch(`/ucp/checkout-sessions/${id}/complete`, { method: 'POST', body: JSON.stringify({}) }),
};

export const authApi = {
    login: (credentials: any) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    logout: () => apiFetch('/auth/logout', { method: 'POST' }),
    getSession: () => apiFetch('/auth/session'),
};

export const historyApi = {
    get: () => apiFetch('/history'),
};
