// packages/backend/src/index.ts
import express from 'express';
import cors from 'cors';
import { cartRouter } from './routes/cart';
import { ucpRouter } from './routes/ucp';
import { historyRouter } from './routes/history';
import { authRouter } from './routes/auth';

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Preflight/CORS handling at the very top
const corsOptions = {
    origin: 'https://yama-ucp-store.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Explicitly handle all OPTIONS requests
app.options('*', (req, res) => {
    res.status(200).send();
});

app.use(express.json());

// 2. Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 3. Regular Routes
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/ucp', ucpRouter);
app.use('/api/history', historyRouter);

// Error Handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
