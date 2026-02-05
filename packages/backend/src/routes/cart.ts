// packages/backend/src/routes/cart.ts
import { Router } from 'express';
import { store } from '../stores/memoryStore';
import { CartItem } from '../types';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const cartRouter = Router();

cartRouter.use(authMiddleware);

cartRouter.get('/', (req: AuthRequest, res) => {
    const userId = req.userId!;
    const items = store.getCart(userId);
    res.json(items);
});

cartRouter.post('/', (req: AuthRequest, res) => {
    const userId = req.userId!;
    const newItem: CartItem = req.body;

    let items = store.getCart(userId);
    const existingIndex = items.findIndex(item => item.id === newItem.id);

    if (existingIndex > -1) {
        items[existingIndex].quantity += newItem.quantity;
    } else {
        items.push(newItem);
    }

    store.setCart(userId, items);
    res.json(items);
});

cartRouter.delete('/:id', (req: AuthRequest, res) => {
    const userId = req.userId!;
    const { id } = req.params;

    let items = store.getCart(userId);
    items = items.filter(item => item.id !== id);

    store.setCart(userId, items);
    res.json(items);
});

cartRouter.post('/clear', (req: AuthRequest, res) => {
    const userId = req.userId!;
    store.clearCart(userId);
    res.json([]);
});
