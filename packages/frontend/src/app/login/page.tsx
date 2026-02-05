'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ username, password });
        } catch (err: any) {
            setError('ログインに失敗しました。ユーザIDとパスワードを確認してください。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#333] font-sans flex flex-col justify-center items-center px-6">
            <Link href="/products" className="text-2xl font-serif tracking-widest uppercase mb-12">Yama Store</Link>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-[#eee] w-full max-w-md">
                <h1 className="text-2xl font-serif mb-2 text-center">Welcome Back</h1>
                <p className="text-zinc-400 text-sm text-center mb-8">ログインしてショッピングを続けましょう</p>

                {error && (
                    <div className="bg-red-50 text-red-500 text-xs p-4 rounded-xl mb-6 text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">User ID</label>
                        <input
                            type="text"
                            required
                            placeholder="user01"
                            className="bg-zinc-50 border border-[#eee] rounded-xl px-4 py-4 outline-none focus:border-pink-300 transition-colors"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Password</label>
                        <input
                            type="password"
                            required
                            className="bg-zinc-50 border border-[#eee] rounded-xl px-4 py-4 outline-none focus:border-pink-300 transition-colors"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#333] text-white py-5 rounded-full font-medium hover:bg-black transition-all shadow-lg active:scale-95 disabled:bg-zinc-300 mt-4"
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-[#eee] text-center">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        テスト用ユーザ: user01 / user02<br />
                        ※パスワードはバックエンドの起動ログを確認してください。
                    </p>
                </div>
            </div>
        </div>
    );
}
