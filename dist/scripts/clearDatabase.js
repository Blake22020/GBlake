"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../config/db");
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
async function clearDatabase() {
    try {
        await (0, db_1.connectDB)();
        console.log("Starting database cleanup...");
        // Delete all documents from each collection
        const userResult = await User_1.default.deleteMany({});
        const postResult = await Post_1.default.deleteMany({});
        console.log(`Deleted ${userResult.deletedCount} users`);
        console.log(`Deleted ${postResult.deletedCount} posts`);
        // Close connection
        await mongoose_1.default.connection.close();
        console.log("Database cleared successfully!");
    }
    catch (error) {
        console.error("Error clearing database:", error);
        process.exit(1);
    }
}
clearDatabase();
