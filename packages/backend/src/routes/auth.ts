// packages/backend/src/routes/auth.ts
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../stores';
import { AuthToken } from '../types';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await store.getUser(username);

    if (user && user.password === password) {
        const tokenStr = uuidv4();
        const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
        const token: AuthToken = {
            token: tokenStr,
            userId: user.id,
            expiresAt
        };
        await store.saveToken(token);
        res.json({ token: tokenStr, username: user.username });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

authRouter.post('/logout', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const tokenStr = authHeader.substring(7);
        await store.deleteToken(tokenStr);
    }
    res.json({ success: true });
});

authRouter.get('/session', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const tokenStr = authHeader.substring(7);
        const token = await store.getToken(tokenStr);
        if (token) {
            const user = await store.getUser(token.userId);
            return res.json({ username: user?.username });
        }
    }
    res.status(401).json({ error: 'Unauthorized' });
});
