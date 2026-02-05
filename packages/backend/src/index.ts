// packages/backend/src/index.ts
import express from 'express';
import cors from 'cors';
import { cartRouter } from './routes/cart';
import { ucpRouter } from './routes/ucp';
import { historyRouter } from './routes/history';
import { authRouter } from './routes/auth';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/ucp', ucpRouter);
app.use('/api/history', historyRouter);

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
