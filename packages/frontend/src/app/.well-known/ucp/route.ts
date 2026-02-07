import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';  // 静的最適化無効化

export async function GET() {
    return NextResponse.json({
        ucp: {
            version: "2026-01-11",
            name: "UCP Store Demo",
            description: "Next.js + Vercel UCP Implementation",
            services: {
                "dev.ucp.shopping": {
                    version: "2026-01-11",
                    spec: "https://ucp.dev/specification/overview",
                    rest: {
                        schema: "https://ucp.dev/services/shopping/rest.openapi.json",
                        endpoint: "https://yama-ucp-store.vercel.app/api/ucp"
                    },
                    extensions: {
                        products_endpoint: "https://yama-ucp-store-backend.vercel.app/api/products"
                    }
                }
            },
            capabilities: [
                {
                    name: "dev.ucp.shopping.checkout",
                    version: "2026-01-11",
                    spec: "https://ucp.dev/specification/checkout"
                }
            ]
        }
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600, immutable'
        }
    });
}
