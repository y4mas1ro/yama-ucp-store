'use client';

import { useState } from 'react';
import { cartApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AddToCartButton({ product }: { product: any }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { token } = useAuth();

    const handleAddToCart = async () => {
        if (!token) {
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            await cartApi.add({
                id: product.id,
                title: product.title,
                price: product.price,
                imageLink: product.imageLink,
                quantity: 1,
            });
            router.push('/cart');
        } catch (error) {
            console.error('Failed to add to cart:', error);
            alert('カートへの追加に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={loading}
            className="w-full bg-[#333] text-white py-5 rounded-full font-medium hover:bg-black transition-all shadow-lg active:scale-95 disabled:bg-zinc-300"
        >
            {loading ? 'Adding...' : 'Add to Cart'}
        </button>
    );
}
