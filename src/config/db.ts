import mongoose from "mongoose";
import { env } from './env'

export async function connectDB() {
    try {
        const conn = await mongoose.connect(env.mongoUrl);
        console.log("MongoDB Connected! =)");
    } catch (e) {
        console.error("DB ERROR: ", e);
        process.exit(1);
    }
}