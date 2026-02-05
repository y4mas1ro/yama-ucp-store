'use client';

import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { historyApi } from '@/lib/api';

export default function MyPage() {
    const { user, logout, token } = useAuth();
    const [recentOrders, setRecentOrders] = useState<any[]>([]);

    useEffect(() => {
        if (token) {
            historyApi.get().then(data => setRecentOrders(data.slice(-3).reverse()));
        }
    }, [token]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#333] font-sans pb-20">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Profile Section */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#eee] text-center">
                            <div className="w-24 h-24 bg-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center text-pink-500 text-3xl font-serif">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-serif mb-1">{user.username}</h2>
                            <p className="text-xs text-zinc-400 uppercase tracking-widest mb-8">Premium Member</p>

                            <button
                                onClick={logout}
                                className="w-full border border-[#eee] py-3 rounded-full text-sm hover:bg-zinc-50 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-grow flex flex-col gap-8">
                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/cart" className="bg-white p-6 rounded-3xl shadow-sm border border-[#eee] hover:shadow-md transition-all group">
                                <h3 className="font-serif text-lg group-hover:text-pink-400 transition-colors">Shopping Cart</h3>
                                <p className="text-xs text-zinc-400 mt-1">アイテムを確認する &rarr;</p>
                            </Link>
                            <Link href="/history" className="bg-white p-6 rounded-3xl shadow-sm border border-[#eee] hover:shadow-md transition-all group">
                                <h3 className="font-serif text-lg group-hover:text-pink-400 transition-colors">Order History</h3>
                                <p className="text-xs text-zinc-400 mt-1">すべての注文を見る &rarr;</p>
                            </Link>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#eee]">
                            <h3 className="text-xl font-serif mb-6">Recent Orders</h3>
                            {recentOrders.length === 0 ? (
                                <p className="text-sm text-zinc-400 text-center py-8">最近の注文はありません。</p>
                            ) : (
                                <div className="space-y-4">
                                    {recentOrders.map((order: any) => (
                                        <div key={order.id} className="flex justify-between items-center py-4 border-b border-[#faf9f6] last:border-0">
                                            <div>
                                                <p className="text-sm font-mono font-bold">{order.order_number}</p>
                                                <p className="text-[10px] text-zinc-400 uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-sm">¥{Number(order.total).toLocaleString()}</p>
                                                <span className="text-[9px] bg-green-50 text-green-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Delivered</span>
                                            </div>
                                        </div>
                                    ))}
                                    <Link href="/history" className="block text-center text-xs text-pink-400 font-semibold mt-4 hover:underline">
                                        View All Orders
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Settings Placeholder */}
                        <div className="bg-[#faf9f6] border-2 border-dashed border-[#eee] p-8 rounded-3xl text-center">
                            <p className="text-zinc-400 text-sm">Account settings and preferences coming soon.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
