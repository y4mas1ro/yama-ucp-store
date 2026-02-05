// packages/backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { store } from '../stores/memoryStore';

export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const tokenStr = authHeader.substring(7);
        const token = store.getToken(tokenStr);

        if (token) {
            req.userId = token.userId;
            return next();
        }
    }

    res.status(401).json({ error: 'Unauthorized: Token expired or missing' });
};
