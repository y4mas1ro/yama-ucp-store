// src/app/api/merchant/products/[id]/route.ts
import { NextRequest } from 'next/server';
import { merchantProducts } from '@/lib/merchantProducts';

type Params = { id: string };

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const { id } = await params;
    const product = merchantProducts.find((p) => p.id === id);

    if (!product) {
        return new Response('Not Found', { status: 404 });
    }

    const item = {
        offerId: product.id,
        title: product.title,
        description: product.description,
        link: product.link,
        mobileLink: product.mobileLink,
        imageLink: product.imageLink,
        availability: product.availability,
        price: product.price,
        condition: product.condition,
    };

    return Response.json(item);
}
