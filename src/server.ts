import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import feedRoutes from './routes/feedRoutes';
import { env } from './config/env';
import { connectDB } from './config/db'

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', async (_req, res) => {
    res.send('GET /');
});

app.use("/api/users", userRoutes);
app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/feed", feedRoutes);

const PORT = env.port || 3000;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server listening on ${PORT}`);
})