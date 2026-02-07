import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { merchantProducts } from '@/lib/merchantProducts';
import AddToCartButton from '@/components/AddToCartButton';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = merchantProducts.find((p) => p.id === id);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: `${product.title} | Yama UCP Store`,
        description: product.description,
        alternates: {
            canonical: product.link,
        },
        openGraph: {
            title: product.title,
            description: product.description,
            images: [product.imageLink],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = merchantProducts.find((p) => p.id === id);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#333] font-sans">
            <header className="py-6 px-8 border-b border-[#eee] bg-white">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-xl font-serif tracking-widest uppercase">Yama Store</Link>
                    <nav className="hidden md:flex gap-8 text-sm uppercase tracking-wider">
                        <Link href="/products" className="hover:text-pink-400 transition-colors">Shop</Link>
                        <Link href="/cart" className="hover:text-pink-400 transition-colors">Cart</Link>
                        <Link href="/history" className="hover:text-pink-400 transition-colors">History</Link>
                    </nav>
                </div>
            </header>

            {/* Schema.org Product Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": product.title,
                        "description": product.description,
                        "image": product.imageLink,
                        "offers": {
                            "@type": "Offer",
                            "price": product.price.value,
                            "priceCurrency": product.price.currency,
                            "availability": product.availability === 'IN_STOCK'
                                ? "https://schema.org/InStock"
                                : "https://schema.org/OutOfStock",
                            "url": product.link
                        }
                    })
                }}
            />

            <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Image Section */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
                            <Image
                                src={product.imageLink.includes('/images/') ? `/images/${product.imageLink.split('/images/')[1]}` : product.imageLink}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                                unoptimized
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col gap-8 md:pt-4">
                        <div className="flex flex-col gap-2">
                            <span className="text-pink-400 text-xs font-semibold uppercase tracking-[0.2em]">New Arrival</span>
                            <h1 className="text-3xl md:text-4xl font-serif leading-tight">{product.title}</h1>
                            <p className="text-2xl text-zinc-800 mt-2">
                                {product.price.currency === 'JPY' ? '¥' : ''}
                                {Number(product.price.value.replace(/,/g, '')).toLocaleString()}
                            </p>
                        </div>

                        <div className="w-full h-px bg-[#eee]"></div>

                        <div className="flex flex-col gap-4">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Product Description</h2>
                            <p className="text-lg leading-relaxed text-zinc-600">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex flex-col gap-6 mt-4">
                            <div className="flex items-center gap-4">
                                <span className={`h-2 w-2 rounded-full ${product.availability === 'IN_STOCK' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                <span className="text-sm text-zinc-500">
                                    {product.availability === 'IN_STOCK' ? '在庫あり' : '在庫なし'}
                                </span>
                            </div>

                            <AddToCartButton product={product} />

                            <p className="text-center text-xs text-zinc-400">
                                最短で明日お届けします。
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mt-8 border-t border-[#eee] pt-8">
                            <details className="group cursor-pointer">
                                <summary className="flex justify-between items-center text-sm font-medium py-2">
                                    <span>配送・送料について</span>
                                    <span className="transition-transform group-open:rotate-180">↓</span>
                                </summary>
                                <p className="text-xs text-zinc-500 py-2 leading-relaxed">
                                    全国一律 500円（税込）。10,000円以上のお買い上げで送料無料となります。
                                </p>
                            </details>
                            <details className="group cursor-pointer">
                                <summary className="flex justify-between items-center text-sm font-medium py-2">
                                    <span>返品・交換について</span>
                                    <span className="transition-transform group-open:rotate-180">↓</span>
                                </summary>
                                <p className="text-xs text-zinc-500 py-2 leading-relaxed">
                                    お届けから7日以内にご連絡いただければ、未使用品に限り返品・交換を承ります。
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white py-12 px-8 border-t border-[#eee] mt-12 text-center">
                <p className="text-sm text-zinc-400">&copy; 2026 Yama Store All Rights Reserved.</p>
            </footer>
        </div>
    );
}
