import mongoose from "mongoose";
import User from "../models/User";
import Post from "../models/Post";
import { connectDB } from "../config/db";
import { env } from "../config/env";
import * as dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения, так как скрипт запускается отдельно
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const clearDatabase = async () => {
    try {
        console.log("Connecting to database...");
        await connectDB();
        console.log("Connected to database successfully.");

        console.log("Clearing Users collection...");
        const userResult = await User.deleteMany({});
        console.log(`Deleted ${userResult.deletedCount} users.`);

        console.log("Clearing Posts collection...");
        const postResult = await Post.deleteMany({});
        console.log(`Deleted ${postResult.deletedCount} posts.`);

        console.log("Database cleared successfully!");

    } catch (error) {
        console.error("Error clearing database:", error);
    } finally {
        console.log("Disconnecting from database...");
        await mongoose.disconnect();
        console.log("Disconnected.");
        process.exit(0);
    }
}

clearDatabase();
