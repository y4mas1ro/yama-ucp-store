// src/app/api/merchant/products/route.ts
import { NextRequest } from 'next/server';
import { merchantProducts } from '@/lib/merchantProducts';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') ?? '').toLowerCase();

    const filtered = q
        ? merchantProducts.filter((p) =>
            (p.title + p.description).toLowerCase().includes(q)
        )
        : merchantProducts;

    const items = filtered.map((p) => ({
        offerId: p.id,
        title: p.title,
        description: p.description,
        link: p.link,
        mobileLink: p.mobileLink,
        imageLink: p.imageLink,
        availability: p.availability,
        price: p.price,
        condition: p.condition,
    }));

    return Response.json({ items, total: filtered.length });
}
