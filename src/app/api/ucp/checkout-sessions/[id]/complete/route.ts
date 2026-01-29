// src/app/api/ucp/checkout-sessions/[id]/complete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutSession, completeCheckoutSession } from '@/lib/checkoutSessions';

export const dynamic = 'force-dynamic';

type Params = { id: string };

export async function POST(
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

        // Check if session is already completed or canceled
        if (session.status === 'completed') {
            return NextResponse.json(
                { error: 'Checkout session is already completed' },
                { status: 400 }
            );
        }

        if (session.status === 'canceled') {
            return NextResponse.json(
                { error: 'Checkout session is canceled' },
                { status: 400 }
            );
        }

        // Get payment data from request body (optional)
        const body = await req.json().catch(() => ({}));
        const paymentData = body.payment_data;
        const riskSignals = body.risk_signals;

        // Complete the checkout session
        const completedSession = completeCheckoutSession(id, { paymentData, riskSignals });

        if (!completedSession) {
            return NextResponse.json(
                { error: 'Failed to complete checkout session' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            ucp: {
                version: '2026-01-11',
                name: 'dev.ucp.shopping.checkout'
            },
            ...completedSession
        });

    } catch (error) {
        console.error('Error completing checkout session:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
