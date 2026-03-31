import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB() {
    try {
        const conn = await mongoose.connect(env.mongoUrl, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host} =)`);
    } catch (e) {
        console.error("DB ERROR: ", e);
        console.log("Retrying in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
}
