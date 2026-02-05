// packages/backend/src/routes/history.ts
import { Router } from 'express';
import { store } from '../stores';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const historyRouter = Router();

historyRouter.use(authMiddleware);

historyRouter.get('/', async (req: AuthRequest, res) => {
    const userId = req.userId!;
    const history = await store.getHistory(userId);
    res.json(history);
});
