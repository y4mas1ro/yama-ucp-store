// packages/backend/src/routes/history.ts
import { Router } from 'express';
import { store } from '../stores/memoryStore';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const historyRouter = Router();

historyRouter.use(authMiddleware);

historyRouter.get('/', (req: AuthRequest, res) => {
    const userId = req.userId!;
    const history = store.getHistory(userId);
    res.json(history);
});
