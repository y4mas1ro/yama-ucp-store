// packages/backend/src/stores/memoryStore.ts
import { CheckoutSession, CartItem, PurchaseRecord, User, AuthToken } from '../types';
import { IStore } from './baseStore';

export class MemoryStore implements IStore {
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
    async getUser(username: string): Promise<User | undefined> {
        return this.users.get(username);
    }

    async saveToken(token: AuthToken): Promise<void> {
        this.tokens.set(token.token, token);
    }

    async getToken(tokenStr: string): Promise<AuthToken | undefined> {
        const token = this.tokens.get(tokenStr);
        if (token && token.expiresAt > Date.now()) {
            return token;
        }
        if (token) this.tokens.delete(tokenStr);
        return undefined;
    }

    async deleteToken(tokenStr: string): Promise<void> {
        this.tokens.delete(tokenStr);
    }

    // Cart operations
    async getCart(userId: string): Promise<CartItem[]> {
        return this.carts.get(userId) || [];
    }

    async setCart(userId: string, items: CartItem[]): Promise<void> {
        this.carts.set(userId, items);
    }

    async clearCart(userId: string): Promise<void> {
        this.carts.delete(userId);
    }

    // History operations
    async getHistory(userId: string): Promise<PurchaseRecord[]> {
        return this.history.get(userId) || [];
    }

    async addHistory(userId: string, record: PurchaseRecord): Promise<void> {
        const records = await this.getHistory(userId);
        records.push(record);
        this.history.set(userId, records);
    }

    // Checkout Session operations
    async getSession(sessionId: string): Promise<CheckoutSession | undefined> {
        return this.sessions.get(sessionId);
    }

    async setSession(sessionId: string, session: CheckoutSession): Promise<void> {
        this.sessions.set(sessionId, session);
    }

    async deleteSession(sessionId: string): Promise<void> {
        this.sessions.delete(sessionId);
    }
}
