// src/app/api/ucp/checkout-sessions/[id]/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutSession, cancelCheckoutSession } from '@/lib/checkoutSessions';

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
                { error: 'Cannot cancel a completed checkout session' },
                { status: 400 }
            );
        }

        if (session.status === 'canceled') {
            return NextResponse.json(
                { error: 'Checkout session is already canceled' },
                { status: 400 }
            );
        }

        // Cancel the checkout session
        const canceledSession = cancelCheckoutSession(id);

        if (!canceledSession) {
            return NextResponse.json(
                { error: 'Failed to cancel checkout session' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            ucp: {
                version: '2026-01-11',
                name: 'dev.ucp.shopping.checkout'
            },
            ...canceledSession
        });

    } catch (error) {
        console.error('Error canceling checkout session:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
