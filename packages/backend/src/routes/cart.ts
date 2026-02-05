// packages/backend/src/routes/cart.ts
import { Router } from 'express';
import { store } from '../stores';
import { CartItem } from '../types';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const cartRouter = Router();

cartRouter.use(authMiddleware);

cartRouter.get('/', async (req: AuthRequest, res) => {
    const userId = req.userId!;
    const items = await store.getCart(userId);
    res.json(items);
});

cartRouter.post('/', async (req: AuthRequest, res) => {
    const userId = req.userId!;
    const newItem: CartItem = req.body;

    let items = await store.getCart(userId);
    const existingIndex = items.findIndex(item => item.id === newItem.id);

    if (existingIndex > -1) {
        items[existingIndex].quantity += newItem.quantity;
    } else {
        items.push(newItem);
    }

    await store.setCart(userId, items);
    res.json(items);
});

cartRouter.delete('/:id', async (req: AuthRequest, res) => {
    const userId = req.userId!;
    const { id } = req.params;

    let items = await store.getCart(userId);
    items = items.filter(item => item.id !== id);

    await store.setCart(userId, items);
    res.json(items);
});

cartRouter.post('/clear', async (req: AuthRequest, res) => {
    const userId = req.userId!;
    await store.clearCart(userId);
    res.json([]);
});
