'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const { user, logout, token } = useAuth();

    return (
        <header className="py-6 px-8 border-b border-[#eee] bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link href="/products" className="text-xl font-serif tracking-widest uppercase hover:text-pink-400 transition-colors">Yama Store</Link>

                <nav className="flex gap-4 md:gap-8 text-[10px] md:text-sm uppercase tracking-wider items-center">
                    <Link href="/products" className="hover:text-pink-400 transition-colors">Shop</Link>
                    {token ? (
                        <>
                            <Link href="/cart" className="hover:text-pink-400 transition-colors">Cart</Link>
                            <Link href="/mypage" className="hover:text-pink-400 transition-colors font-semibold text-pink-500">My Page</Link>
                            <button
                                onClick={logout}
                                className="hover:text-pink-400 transition-colors text-zinc-400"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="bg-[#333] text-white px-4 py-2 rounded-full hover:bg-black transition-all">Login</Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
