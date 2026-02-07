import { Router } from 'express';

const router = Router();

// Product catalog (in-memory for now)
const products = [
    {
        id: 'apple_01',
        title: 'ご褒美りんごジュエル',
        description: 'シャキッと甘酸っぱいりんご。新鮮で瑞々しい、贅沢な一品です。',
        price: { value: '480.00', currency: 'JPY' },
        imageLink: 'https://yama-ucp-store.vercel.app/images/apple_01.jpg',
        availability: 'in_stock'
    },
    {
        id: 'orange_01',
        title: 'おうちカフェのみかんスイート',
        description: 'ジューシーみかん。甘さと酸味のバランスが絶妙です。',
        price: { value: '380.00', currency: 'JPY' },
        imageLink: 'https://yama-ucp-store.vercel.app/images/orange_01.jpg',
        availability: 'in_stock'
    },
    {
        id: 'melon_01',
        title: 'ときめきメロンスパークル',
        description: 'とろける甘さのリッチなメロン。高級感あふれる味わいです。',
        price: { value: '1980.00', currency: 'JPY' },
        imageLink: 'https://yama-ucp-store.vercel.app/images/melon_01.jpg',
        availability: 'in_stock'
    }
];

// GET /api/products?q={query}
router.get('/', (req, res) => {
    const query = req.query.q as string;

    if (!query) {
        // Return all products if no query
        return res.json(products);
    }

    // Filter products by title or description
    const filtered = products.filter(p =>
        p.title.includes(query) || p.description.includes(query)
    );

    res.json(filtered);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
});

export default router;
