// src/app/api/ucp/checkout-sessions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutSession, updateCheckoutSession } from '@/lib/checkoutSessions';
import type { LineItem, Buyer, Payment } from '@/lib/checkoutSessions';

export const dynamic = 'force-dynamic';

type Params = { id: string };

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<Params> }
) {
    try {
        const { id } = await params;
        const session = getCheckoutSession(id);

        if (!session) {
            return NextResponse.json(
                { error: 'Checkout session not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            ucp: {
                version: '2026-01-11',
                name: 'dev.ucp.shopping.checkout'
            },
            ...session
        });

    } catch (error) {
        console.error('Error retrieving checkout session:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<Params> }
) {
    try {
        const { id } = await params;
        const session = getCheckoutSession(id);

        if (!session) {
            return NextResponse.json(
                { error: 'Checkout session not found' },
                { status: 404 }
            );
        }

        const body = await req.json();

        // Prepare updates
        const updates: any = {};

        if (body.line_items) {
            updates.line_items = body.line_items as LineItem[];

            // Recalculate totals if line items changed
            const subtotal = updates.line_items.reduce((sum: number, item: LineItem) => {
                return sum + parseFloat(item.unit_price.value) * item.quantity;
            }, 0);

            updates.totals = [
                {
                    type: 'subtotal' as const,
                    label: 'Subtotal',
                    amount: { value: subtotal.toFixed(2), currency: session.currency }
                },
                {
                    type: 'total' as const,
                    label: 'Total',
                    amount: { value: subtotal.toFixed(2), currency: session.currency }
                }
            ];
        }

        if (body.buyer) {
            updates.buyer = body.buyer as Buyer;
        }

        if (body.payment) {
            updates.payment = body.payment as Payment;
        }

        // Update session
        const updatedSession = updateCheckoutSession(id, updates);

        if (!updatedSession) {
            return NextResponse.json(
                { error: 'Failed to update checkout session' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            ucp: {
                version: '2026-01-11',
                name: 'dev.ucp.shopping.checkout'
            },
            ...updatedSession
        });

    } catch (error) {
        console.error('Error updating checkout session:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
