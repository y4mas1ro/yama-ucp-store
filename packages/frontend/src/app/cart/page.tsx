'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cartApi, ucpApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
    const { token, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!token) return;
        const fetchCart = async () => {
            try {
                const items = await cartApi.get();
                setCartItems(items);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [token]);

    const handleRemove = async (id: string) => {
        try {
            const updatedItems = await cartApi.remove(id);
            setCartItems(updatedItems);
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        try {
            const session = await ucpApi.createSession({
                line_items: cartItems.map(item => ({
                    offer_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price,
                    title: item.title,
                })),
                currency: 'JPY',
                payment: {
                    methods: [{ type: 'card', provider: 'stripe' }]
                }
            });
            router.push(`/checkout/${session.id}`);
        } catch (error) {
            console.error('Failed to create checkout session:', error);
            alert('チェックアウトの開始に失敗しました。');
        } finally {
            setCheckoutLoading(false);
        }
    };

    const total = cartItems.reduce((sum, item) => {
        return sum + parseFloat(item.price.value.replace(/,/g, '')) * item.quantity;
    }, 0);

    if (authLoading || (loading && token)) return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
            <div className="animate-pulse text-zinc-400 font-serif">Loading your cart...</div>
        </div>
    );

    if (!token) return null;

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#333] font-sans pb-20">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-serif mb-12 text-center">Your Shopping Bag</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[#eee]">
                        <p className="text-zinc-500 mb-8">カートは空です。</p>
                        <Link href="/products" className="inline-block bg-[#333] text-white px-10 py-4 rounded-full font-medium hover:bg-black transition-all">
                            商品を見る
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-[#eee] flex gap-6 items-center">
                                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0">
                                        <Image
                                            src={item.imageLink.includes('/images/') ? `/images/${item.imageLink.split('/images/')[1]}` : item.imageLink}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-serif text-lg">{item.title}</h3>
                                        <p className="text-sm text-zinc-500 mb-2">Quantity: {item.quantity}</p>
                                        <p className="font-medium">
                                            {item.price.currency === 'JPY' ? '¥' : ''}
                                            {Number(item.price.value.replace(/,/g, '')).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-zinc-300 hover:text-red-400 transition-colors px-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="bg-white p-8 rounded-3xl shadow-md border border-[#eee] sticky top-28">
                                <h2 className="text-xl font-serif mb-6">Order Summary</h2>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-zinc-500">
                                        <span>Subtotal</span>
                                        <span>¥{total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-500">
                                        <span>Shipping</span>
                                        <span className="text-xs uppercase tracking-widest text-green-500 font-bold">Free</span>
                                    </div>
                                    <div className="h-px bg-[#eee] my-4"></div>
                                    <div className="flex justify-between text-xl font-serif">
                                        <span>Total</span>
                                        <span>¥{total.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={checkoutLoading}
                                    className="w-full bg-[#333] text-white py-5 rounded-full font-medium hover:bg-black transition-all shadow-lg active:scale-95 disabled:bg-zinc-300"
                                >
                                    {checkoutLoading ? 'Processing...' : 'Checkout Now'}
                                </button>
                                <p className="text-[10px] text-zinc-400 mt-6 text-center leading-relaxed">
                                    Secure Checkout by UCP Protocol.<br />
                                    Taxes calculated at next step.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
