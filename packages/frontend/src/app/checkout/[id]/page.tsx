'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ucpApi } from '@/lib/api';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
    const { id } = useParams();
    const router = useRouter();
    const { token, loading: authLoading } = useAuth();
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);

    const [buyer, setBuyer] = useState({
        email: '',
        name: {
            family_name: '',
            given_name: ''
        },
        shipping_address: {
            postal_code: '',
            administrative_area: '',
            locality: '',
            address_line_1: '',
            country_code: 'JP'
        }
    });

    useEffect(() => {
        if (!token) return;
        const fetchSession = async () => {
            try {
                const data = await ucpApi.getSession(id as string);
                setSession(data);
                if (data.buyer) {
                    setBuyer(prev => ({ ...prev, ...data.buyer }));
                }
            } catch (error) {
                console.error('Failed to fetch session:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [id, token]);

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        setCompleting(true);
        try {
            // First update session with buyer info
            await ucpApi.updateSession(id as string, { buyer });
            // Then complete
            await ucpApi.completeSession(id as string);
            router.push('/history');
        } catch (error) {
            console.error('Failed to complete checkout:', error);
            alert('購入処理に失敗しました。');
        } finally {
            setCompleting(false);
        }
    };

    if (authLoading || (loading && token)) return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
            <div className="animate-pulse text-zinc-400 font-serif">Loading checkout...</div>
        </div>
    );

    if (!token) return null;

    if (!session) return <div>Session not found</div>;

    const total = session.totals.find((t: any) => t.type === 'total')?.amount;

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#333] font-sans pb-20">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Form Section */}
                    <div>
                        <h1 className="text-2xl font-serif mb-8">Shipping Information</h1>
                        <form onSubmit={handleComplete} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Family Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="bg-white border border-[#eee] rounded-xl px-4 py-3 outline-none focus:border-pink-300 transition-colors"
                                        value={buyer.name.family_name}
                                        onChange={e => setBuyer({ ...buyer, name: { ...buyer.name, family_name: e.target.value } })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Given Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="bg-white border border-[#eee] rounded-xl px-4 py-3 outline-none focus:border-pink-300 transition-colors"
                                        value={buyer.name.given_name}
                                        onChange={e => setBuyer({ ...buyer, name: { ...buyer.name, given_name: e.target.value } })}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="bg-white border border-[#eee] rounded-xl px-4 py-3 outline-none focus:border-pink-300 transition-colors"
                                    value={buyer.email}
                                    onChange={e => setBuyer({ ...buyer, email: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Postal Code</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="000-0000"
                                    className="bg-white border border-[#eee] rounded-xl px-4 py-3 outline-none focus:border-pink-300 transition-colors"
                                    value={buyer.shipping_address.postal_code}
                                    onChange={e => setBuyer({ ...buyer, shipping_address: { ...buyer.shipping_address, postal_code: e.target.value } })}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Prefecture / City</label>
                                <input
                                    type="text"
                                    required
                                    className="bg-white border border-[#eee] rounded-xl px-4 py-3 outline-none focus:border-pink-300 transition-colors"
                                    value={buyer.shipping_address.administrative_area}
                                    onChange={e => setBuyer({ ...buyer, shipping_address: { ...buyer.shipping_address, administrative_area: e.target.value } })}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Street Address</label>
                                <input
                                    type="text"
                                    required
                                    className="bg-white border border-[#eee] rounded-xl px-4 py-3 outline-none focus:border-pink-300 transition-colors"
                                    value={buyer.shipping_address.address_line_1}
                                    onChange={e => setBuyer({ ...buyer, shipping_address: { ...buyer.shipping_address, address_line_1: e.target.value } })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={completing}
                                className="w-full bg-[#333] text-white py-5 rounded-full font-medium hover:bg-black transition-all shadow-lg active:scale-95 disabled:bg-zinc-300 mt-8"
                            >
                                {completing ? 'Completing Order...' : 'Confirm Purchase'}
                            </button>
                        </form>
                    </div>

                    {/* Summary Section */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#eee] h-fit">
                        <h2 className="text-xl font-serif mb-6">Order Details</h2>
                        <div className="space-y-4 mb-8">
                            {session.line_items.map((item: any) => (
                                <div key={item.offer_id} className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-600">{item.title} x {item.quantity}</span>
                                    <span className="font-medium">
                                        ¥{(parseFloat(item.unit_price.value.replace(/,/g, '')) * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            <div className="h-px bg-[#eee] my-4"></div>
                            <div className="flex justify-between text-xl font-serif">
                                <span>Total Paid</span>
                                <span>¥{Number(total?.value || 0).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="bg-[#faf9f6] p-4 rounded-2xl text-[10px] text-zinc-400 leading-relaxed uppercase tracking-widest">
                            <p>UCP Session ID: {id}</p>
                            <p className="mt-1">Protocol Version: 2026-01-11</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
