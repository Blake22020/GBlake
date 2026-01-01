import mongoose from "mongoose";
import { connectDB } from "../config/db";
import User from "../models/User";
import Post from "../models/Post";

async function clearDatabase() {
    try {
        await connectDB();
        
        console.log("Starting database cleanup...");
        
        // Delete all documents from each collection
        const userResult = await User.deleteMany({});
        const postResult = await Post.deleteMany({});
        
        console.log(`Deleted ${userResult.deletedCount} users`);
        console.log(`Deleted ${postResult.deletedCount} posts`);
        
        // Close connection
        await mongoose.connection.close();
        console.log("Database cleared successfully!");
        
    } catch (error) {
        console.error("Error clearing database:", error);
        process.exit(1);
    }
}

clearDatabase();