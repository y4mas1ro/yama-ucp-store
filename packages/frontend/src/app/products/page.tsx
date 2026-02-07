import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { searchProducts } from '@/lib/products';
import Header from '@/components/Header';

export const metadata: Metadata = {
    title: 'Our Collection | Yama UCP Store',
    description: 'Explore our curated collection of premium products, including jewels and sweets.',
};

export default async function ProductsPage() {
    const products = await searchProducts();

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#333] font-sans">
            <Header />

            <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">
                <div className="flex flex-col gap-4 mb-12 items-center text-center">
                    <span className="text-pink-400 text-xs font-semibold uppercase tracking-[0.3em]">Curated Collection</span>
                    <h1 className="text-4xl md:text-5xl font-serif">Our Products</h1>
                    <p className="text-zinc-500 max-w-lg mt-2">
                        美しさと美味しさを追求した、自分へのご褒美にぴったりのラインナップ。
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}/`}
                            className="group flex flex-col gap-4"
                        >
                            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:-translate-y-1">
                                <Image
                                    src={product.imageLink.includes('/images/') ? `/images/${product.imageLink.split('/images/')[1]}` : product.imageLink}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    unoptimized
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                                        {product.availability === 'in_stock' ? 'New' : ''}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <h2 className="text-xl font-serif group-hover:text-pink-400 transition-colors">{product.title}</h2>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg text-zinc-800">
                                        {product.price.currency === 'JPY' ? '¥' : ''}
                                        {Number(product.price.value.replace(/,/g, '')).toLocaleString()}
                                    </p>
                                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                        View Detail &rarr;
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <footer className="bg-white py-12 px-8 border-t border-[#eee] mt-16 text-center">
                <p className="text-sm text-zinc-400">&copy; 2026 Yama Store All Rights Reserved.</p>
            </footer>
        </div>
    );
}
