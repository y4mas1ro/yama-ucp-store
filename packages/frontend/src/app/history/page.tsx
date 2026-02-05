'use client';

import { useEffect, useState } from 'react';
import { historyApi } from '@/lib/api';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';

export default function HistoryPage() {
    const { token, loading: authLoading } = useAuth();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        const fetchHistory = async () => {
            try {
                const data = await historyApi.get();
                setHistory(data);
            } catch (error) {
                console.error('Failed to fetch history:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [token]);

    if (authLoading || (loading && token)) return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
            <div className="animate-pulse text-zinc-400 font-serif">Loading history...</div>
        </div>
    );

    if (!token) return null;

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#333] font-sans pb-20">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-serif mb-12 text-center">Order History</h1>

                {history.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[#eee]">
                        <p className="text-zinc-500 mb-8">購入履歴はありません。</p>
                        <Link href="/products" className="inline-block bg-[#333] text-white px-10 py-4 rounded-full font-medium hover:bg-black transition-all">
                            ショッピングを始める
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {history.slice().reverse().map((record) => (
                            <div key={record.id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#eee]">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Order Number</p>
                                        <h3 className="text-lg font-mono font-bold">{record.order_number}</h3>
                                        <p className="text-xs text-zinc-400 mt-1">{new Date(record.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Total Amount</p>
                                        <p className="text-xl font-medium">¥{Number(record.total).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold border-b border-[#faf9f6] pb-2">Items</p>
                                    {record.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-zinc-600">{item.title} x {item.quantity}</span>
                                            <span className="font-medium">¥{Number(item.unit_price.value).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-[#faf9f6] flex justify-end">
                                    <span className="text-[10px] bg-green-50 text-green-500 px-3 py-1 rounded-full uppercase font-bold tracking-widest">
                                        Transaction Completed
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
