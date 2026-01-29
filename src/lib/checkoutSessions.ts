// src/lib/checkoutSessions.ts
import { v4 as uuidv4 } from 'uuid';

// UCP Types
export type CheckoutStatus =
    | 'incomplete'
    | 'requires_escalation'
    | 'ready_for_complete'
    | 'complete_in_progress'
    | 'completed'
    | 'canceled';

export type LineItem = {
    offer_id: string;
    quantity: number;
    unit_price: {
        value: string;
        currency: string;
    };
    title?: string;
    description?: string;
    image_url?: string;
};

export type Buyer = {
    email?: string;
    phone?: string;
    name?: {
        given_name?: string;
        family_name?: string;
    };
    shipping_address?: {
        address_line_1?: string;
        address_line_2?: string;
        locality?: string;
        administrative_area?: string;
        postal_code?: string;
        country_code?: string;
    };
};

export type Total = {
    type: 'subtotal' | 'tax' | 'shipping' | 'discount' | 'total';
    label: string;
    amount: {
        value: string;
        currency: string;
    };
};

export type Link = {
    rel: string;
    href: string;
    title?: string;
};

export type Message = {
    type: 'error' | 'warning' | 'info';
    code?: string;
    message: string;
    field?: string;
};

export type PaymentMethod = {
    type: 'card' | 'wallet' | 'bank_transfer';
    provider?: string;
};

export type Payment = {
    methods: PaymentMethod[];
    selected_method?: PaymentMethod;
};

export type OrderConfirmation = {
    order_id: string;
    order_number?: string;
    created_at: string;
    confirmation_url?: string;
};

export type CheckoutSession = {
    id: string;
    line_items: LineItem[];
    buyer?: Buyer;
    status: CheckoutStatus;
    currency: string;
    totals: Total[];
    messages?: Message[];
    links: Link[];
    expires_at: string;
    continue_url?: string;
    payment: Payment;
    order?: OrderConfirmation;
    created_at: string;
    updated_at: string;
};

// In-memory storage
const sessions = new Map<string, CheckoutSession>();

// Helper functions
export function createCheckoutSession(
    line_items: LineItem[],
    currency: string,
    payment: Payment,
    buyer?: Buyer
): CheckoutSession {
    const id = uuidv4();
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(); // 6 hours

    // Calculate totals
    const subtotal = line_items.reduce((sum, item) => {
        return sum + parseFloat(item.unit_price.value) * item.quantity;
    }, 0);

    const totals: Total[] = [
        {
            type: 'subtotal',
            label: 'Subtotal',
            amount: { value: subtotal.toFixed(2), currency }
        },
        {
            type: 'total',
            label: 'Total',
            amount: { value: subtotal.toFixed(2), currency }
        }
    ];

    const session: CheckoutSession = {
        id,
        line_items,
        buyer,
        status: 'incomplete',
        currency,
        totals,
        links: [
            {
                rel: 'terms_of_service',
                href: 'https://yama-ucp-store.vercel.app/terms',
                title: 'Terms of Service'
            },
            {
                rel: 'privacy_policy',
                href: 'https://yama-ucp-store.vercel.app/privacy',
                title: 'Privacy Policy'
            }
        ],
        expires_at: expiresAt,
        payment,
        created_at: now,
        updated_at: now
    };

    sessions.set(id, session);
    return session;
}

export function getCheckoutSession(id: string): CheckoutSession | undefined {
    return sessions.get(id);
}

export function updateCheckoutSession(
    id: string,
    updates: Partial<Omit<CheckoutSession, 'id' | 'created_at'>>
): CheckoutSession | undefined {
    const session = sessions.get(id);
    if (!session) return undefined;

    const updatedSession: CheckoutSession = {
        ...session,
        ...updates,
        id: session.id,
        created_at: session.created_at,
        updated_at: new Date().toISOString()
    };

    sessions.set(id, updatedSession);
    return updatedSession;
}

export function completeCheckoutSession(
    id: string,
    paymentData?: any
): CheckoutSession | undefined {
    const session = sessions.get(id);
    if (!session) return undefined;

    // Create order
    const order: OrderConfirmation = {
        order_id: uuidv4(),
        order_number: `ORD-${Date.now()}`,
        created_at: new Date().toISOString(),
        confirmation_url: `https://yama-ucp-store.vercel.app/orders/${uuidv4()}`
    };

    return updateCheckoutSession(id, {
        status: 'completed',
        order
    });
}

export function cancelCheckoutSession(id: string): CheckoutSession | undefined {
    return updateCheckoutSession(id, {
        status: 'canceled'
    });
}
