// packages/backend/src/stores/baseStore.ts
import { CheckoutSession, CartItem, PurchaseRecord, User, AuthToken } from '../types';

export interface IStore {
    // Auth operations
    getUser(username: string): Promise<User | undefined>;
    saveToken(token: AuthToken): Promise<void>;
    getToken(tokenStr: string): Promise<AuthToken | undefined>;
    deleteToken(tokenStr: string): Promise<void>;

    // Cart operations
    getCart(userId: string): Promise<CartItem[]>;
    setCart(userId: string, items: CartItem[]): Promise<void>;
    clearCart(userId: string): Promise<void>;

    // History operations
    getHistory(userId: string): Promise<PurchaseRecord[]>;
    addHistory(userId: string, record: PurchaseRecord): Promise<void>;

    // Checkout Session operations
    getSession(sessionId: string): Promise<CheckoutSession | undefined>;
    setSession(sessionId: string, session: CheckoutSession): Promise<void>;
    deleteSession(sessionId: string): Promise<void>;
}
