// packages/backend/src/stores/memoryStore.ts
import { CheckoutSession, CartItem, PurchaseRecord, User, AuthToken } from '../types';
import { v4 as uuidv4 } from 'uuid';

class MemoryStore {
    private carts: Map<string, CartItem[]> = new Map();
    private history: Map<string, PurchaseRecord[]> = new Map();
    private sessions: Map<string, CheckoutSession> = new Map();
    private users: Map<string, User> = new Map();
    private tokens: Map<string, AuthToken> = new Map();

    constructor() {
        this.generateInitialUsers();
    }

    private generateInitialUsers() {
        const userIds = ['user01', 'user02'];
        userIds.forEach(id => {
            const password = 'password01';
            this.users.set(id, { id, username: id, password });
            console.log(`Generated user: ${id} with password: ${password}`);
        });
    }

    // Auth operations
    getUser(username: string): User | undefined {
        return this.users.get(username);
    }

    saveToken(token: AuthToken): void {
        this.tokens.set(token.token, token);
    }

    getToken(tokenStr: string): AuthToken | undefined {
        const token = this.tokens.get(tokenStr);
        if (token && token.expiresAt > Date.now()) {
            return token;
        }
        if (token) this.tokens.delete(tokenStr);
        return undefined;
    }

    deleteToken(tokenStr: string): void {
        this.tokens.delete(tokenStr);
    }

    // Cart operations
    getCart(userId: string): CartItem[] {
        return this.carts.get(userId) || [];
    }

    setCart(userId: string, items: CartItem[]): void {
        this.carts.set(userId, items);
    }

    clearCart(userId: string): void {
        this.carts.delete(userId);
    }

    // History operations
    getHistory(userId: string): PurchaseRecord[] {
        return this.history.get(userId) || [];
    }

    addHistory(userId: string, record: PurchaseRecord): void {
        const records = this.getHistory(userId);
        records.push(record);
        this.history.set(userId, records);
    }

    // Checkout Session operations
    getSession(sessionId: string): CheckoutSession | undefined {
        return this.sessions.get(sessionId);
    }

    setSession(sessionId: string, session: CheckoutSession): void {
        this.sessions.set(sessionId, session);
    }

    deleteSession(sessionId: string): void {
        this.sessions.delete(sessionId);
    }
}

export const store = new MemoryStore();
