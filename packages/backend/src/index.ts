// packages/backend/src/index.ts
import express from 'express';
import cors from 'cors';
import { cartRouter } from './routes/cart';
import { ucpRouter } from './routes/ucp';
import { historyRouter } from './routes/history';
import { authRouter } from './routes/auth';
import productsRouter from './routes/products';

const app = express();
const PORT = process.env.PORT || 3001;

// 0. Request Logger for Debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 1. Preflight/CORS handling at the very top
const corsOptions = {
    origin: 'https://yama-ucp-store.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Explicitly handle all OPTIONS requests before ANY other logic
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS request manually');
        return res.status(200).send();
    }
    next();
});

app.use(express.json());

// 2. Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: {
            NODE_ENV: process.env.NODE_ENV,
            UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? 'PRESENT' : 'MISSING'
        }
    });
});

// 3. Regular Routes
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/ucp', ucpRouter);
app.use('/api/history', historyRouter);
app.use('/api/products', productsRouter);

// Global Error Handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
