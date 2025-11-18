import mongoose from "mongoose";

export async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL as string);
        console.log("MongoDB Connected! =)");
    } catch (e) {
        console.error("DB ERROR: ", e);
        process.exit(1);
    }
}