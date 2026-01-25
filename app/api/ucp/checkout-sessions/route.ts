import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST!);

export async function POST(req: NextRequest) {
    // UCP署名検証（簡易版、後でucp-utils追加）
    const body = await req.json();
    const idempotencyKey = req.headers.get('idempotency-key');

    // テスト商品処理
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: body.items.map((item: any) => ({
            price_data: { /* テスト価格 */ },
            quantity: item.quantity,
        })),
        success_url: `${req.headers.get('origin')}/success`,
    });

    return NextResponse.json({ sessionId: session.id, status: 'open' });
}
