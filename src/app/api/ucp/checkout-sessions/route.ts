import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // 環境変数確認（デバッグ用、一時的）
    if (!process.env.STRIPE_SECRET_KEY_TEST) {
        return NextResponse.json({ error: 'STRIPE_SECRET_KEY_TEST not set' }, { status: 500 });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST);  // 関数内で初期化

    const body = await req.json();

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{
            price_data: {
                currency: 'jpy',
                product_data: { name: 'Test Product' },
                unit_amount: 1000,
            },
            quantity: body.items?.[0]?.quantity || 1,
        }],
        success_url: `${req.headers.get('origin')}/success`,
        cancel_url: `${req.headers.get('origin')}/cancel`,
    });

    return NextResponse.json({
        sessionId: session.id,
        status: 'open',
        checkoutUrl: session.url
    });
}
