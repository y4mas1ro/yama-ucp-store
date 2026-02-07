const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://yama-ucp-store-backend.vercel.app';

export interface Product {
    id: string;
    title: string;
    description: string;
    price: {
        value: string;
        currency: string;
    };
    imageLink: string;
    availability: string;
}

export async function searchProducts(query?: string): Promise<Product[]> {
    const url = query
        ? `${BACKEND_URL}/api/products?q=${encodeURIComponent(query)}`
        : `${BACKEND_URL}/api/products`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
}

export async function getProduct(id: string): Promise<Product> {
    const response = await fetch(`${BACKEND_URL}/api/products/${id}`);
    if (!response.ok) {
        throw new Error('Product not found');
    }
    return response.json();
}
