// packages/backend/src/types.ts

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

export type CartItem = {
    id: string; // offer_id
    title: string;
    price: {
        value: string;
        currency: string;
    };
    quantity: number;
    imageLink: string;
};

export type PurchaseRecord = {
    id: string;
    order_number: string;
    items: LineItem[];
    total: string;
    currency: string;
    created_at: string;
};

export type User = {
    id: string;
    username: string;
    password?: string; // Only used on backend for verification
};

export type AuthToken = {
    token: string;
    userId: string;
    expiresAt: number;
};
