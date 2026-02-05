// packages/backend/src/routes/ucp.ts
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../stores/memoryStore';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import {
    CheckoutSession,
    LineItem,
    Payment,
    Buyer,
    Total,
    OrderConfirmation,
    PurchaseRecord
} from '../types';

export const ucpRouter = Router();

ucpRouter.use(authMiddleware);

// Create checkout session
ucpRouter.post('/checkout-sessions', (req: AuthRequest, res) => {
    const { line_items, currency, payment, buyer } = req.body;

    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
        return res.status(400).json({ error: 'line_items is required' });
    }

    const id = uuidv4();
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();

    const subtotal = line_items.reduce((sum: number, item: LineItem) => {
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
                href: 'http://localhost:3000/terms',
                title: 'Terms of Service'
            },
            {
                rel: 'privacy_policy',
                href: 'http://localhost:3000/privacy',
                title: 'Privacy Policy'
            }
        ],
        expires_at: expiresAt,
        payment,
        created_at: now,
        updated_at: now
    };

    store.setSession(id, session);

    res.status(201).json({
        ucp: {
            version: '2026-01-11',
            name: 'dev.ucp.shopping.checkout'
        },
        ...session
    });
});

// Get checkout session
ucpRouter.get('/checkout-sessions/:id', (req, res) => {
    const id = req.params.id as string;
    const session = store.getSession(id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
});

// Update checkout session
ucpRouter.put('/checkout-sessions/:id', (req, res) => {
    const id = req.params.id as string;
    const session = store.getSession(id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const updates = req.body;
    const updatedSession: CheckoutSession = {
        ...session,
        ...updates,
        id: session.id,
        created_at: session.created_at,
        updated_at: new Date().toISOString()
    };

    store.setSession(id, updatedSession);
    res.json(updatedSession);
});

// Complete checkout session
ucpRouter.post('/checkout-sessions/:id/complete', (req: AuthRequest, res) => {
    const sessionId = req.params.id as string;
    const session = store.getSession(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const order_id = uuidv4();
    const order: OrderConfirmation = {
        order_id,
        order_number: `ORD-${Date.now()}`,
        created_at: new Date().toISOString(),
        confirmation_url: `http://localhost:3000/orders/${order_id}`
    };

    const updatedSession: CheckoutSession = {
        ...session,
        status: 'completed',
        order,
        updated_at: new Date().toISOString()
    };

    store.setSession(sessionId, updatedSession);

    // Add to history
    const userId = req.userId!;
    const record: PurchaseRecord = {
        id: order_id,
        order_number: order.order_number!,
        items: session.line_items,
        total: session.totals.find(t => t.type === 'total')?.amount.value || '0',
        currency: session.currency,
        created_at: order.created_at
    };
    store.addHistory(userId, record);

    // Clear cart
    store.clearCart(userId);

    res.json(updatedSession);
});
