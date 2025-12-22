import express from 'express';
import cors from 'cors';
import path from 'path'

const __dirname__ = process.cwd();

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import feedRoutes from './routes/feedRoutes';
import adminRoutes from './routes/adminRoutes';
import searchRoutes from './routes/searchRoutes';

import { env } from './config/env';
import { connectDB } from './config/db'

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname__, 'uploads')));

app.use("/api/users", userRoutes);
app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/users/", adminRoutes)
app.use("/api/search", searchRoutes)

const clientPath = path.join(__dirname, 'frontend/build')
app.use(express.static(clientPath))

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.sendStatus(404)
  }

  res.sendFile(path.join(clientPath, 'index.html'))
})

const PORT = env.port || 3000;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server listening on ${PORT}`);
})