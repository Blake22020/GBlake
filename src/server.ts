import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { env } from './config/env';
import { connectDB } from './config/db'

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', async (_req, res) => {
    res.send('GET /');
});

app.use("/api", userRoutes);
app.use("/api", authRoutes);

const PORT = env.port || 3000;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server listening on ${PORT}`);
})