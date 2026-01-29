// src/app/api/ucp/checkout-sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/checkoutSessions';
import type { LineItem, Payment, Buyer } from '@/lib/checkoutSessions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate required fields
        if (!body.line_items || !Array.isArray(body.line_items) || body.line_items.length === 0) {
            return NextResponse.json(
                { error: 'line_items is required and must be a non-empty array' },
                { status: 400 }
            );
        }

        if (!body.currency) {
            return NextResponse.json(
                { error: 'currency is required' },
                { status: 400 }
            );
        }

        if (!body.payment) {
            return NextResponse.json(
                { error: 'payment is required' },
                { status: 400 }
            );
        }

        const line_items: LineItem[] = body.line_items;
        const currency: string = body.currency;
        const payment: Payment = body.payment;
        const buyer: Buyer | undefined = body.buyer;

        // Create checkout session
        const session = createCheckoutSession(line_items, currency, payment, buyer);

        // Return UCP-compliant response
        return NextResponse.json({
            ucp: {
                version: '2026-01-11',
                name: 'dev.ucp.shopping.checkout'
            },
            ...session
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
