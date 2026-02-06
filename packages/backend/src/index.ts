// packages/backend/src/index.ts
import express from 'express';
import cors from 'cors';
import { cartRouter } from './routes/cart';
import { ucpRouter } from './routes/ucp';
import { historyRouter } from './routes/history';
import { authRouter } from './routes/auth';

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
    origin: 'https://yama-ucp-store.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/ucp', ucpRouter);
app.use('/api/history', historyRouter);

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
