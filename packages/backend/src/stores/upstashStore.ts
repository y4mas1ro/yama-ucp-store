// packages/backend/src/stores/upstashStore.ts
import { Redis } from '@upstash/redis';
import { CheckoutSession, CartItem, PurchaseRecord, User, AuthToken } from '../types';
import { IStore } from './baseStore';

export class UpstashRedisStore implements IStore {
    private redis: Redis;

    constructor() {
        this.redis = Redis.fromEnv();
        this.initializeUsers();
    }

    private async initializeUsers() {
        const userIds = ['user01', 'user02'];
        for (const id of userIds) {
            const exists = await this.redis.exists(`user:${id}`);
            if (!exists) {
                const password = 'password01';
                await this.redis.set(`user:${id}`, { id, username: id, password });
                console.log(`Initialized user in Redis: ${id}`);
            }
        }
    }

    // Auth operations
    async getUser(username: string): Promise<User | undefined> {
        const user = await this.redis.get<User>(`user:${username}`);
        return user || undefined;
    }

    async saveToken(token: AuthToken): Promise<void> {
        // Set with expiry (convert ms to seconds)
        const ttl = Math.max(0, Math.floor((token.expiresAt - Date.now()) / 1000));
        await this.redis.set(`token:${token.token}`, token, { ex: ttl });
    }

    async getToken(tokenStr: string): Promise<AuthToken | undefined> {
        const token = await this.redis.get<AuthToken>(`token:${tokenStr}`);
        return token || undefined;
    }

    async deleteToken(tokenStr: string): Promise<void> {
        await this.redis.del(`token:${tokenStr}`);
    }

    // Cart operations
    async getCart(userId: string): Promise<CartItem[]> {
        const items = await this.redis.get<CartItem[]>(`cart:${userId}`);
        return items || [];
    }

    async setCart(userId: string, items: CartItem[]): Promise<void> {
        await this.redis.set(`cart:${userId}`, items);
    }

    async clearCart(userId: string): Promise<void> {
        await this.redis.del(`cart:${userId}`);
    }

    // History operations
    async getHistory(userId: string): Promise<PurchaseRecord[]> {
        const history = await this.redis.get<PurchaseRecord[]>(`history:${userId}`);
        return history || [];
    }

    async addHistory(userId: string, record: PurchaseRecord): Promise<void> {
        const history = await this.getHistory(userId);
        history.push(record);
        await this.redis.set(`history:${userId}`, history);
    }

    // Checkout Session operations
    async getSession(sessionId: string): Promise<CheckoutSession | undefined> {
        const session = await this.redis.get<CheckoutSession>(`session:${sessionId}`);
        return session || undefined;
    }

    async setSession(sessionId: string, session: CheckoutSession): Promise<void> {
        // Basic expiry for sessions (e.g., 24h)
        await this.redis.set(`session:${sessionId}`, session, { ex: 24 * 60 * 60 });
    }

    async deleteSession(sessionId: string): Promise<void> {
        await this.redis.del(`session:${sessionId}`);
    }
}
