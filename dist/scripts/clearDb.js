"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const db_1 = require("../config/db");
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Загружаем переменные окружения, так как скрипт запускается отдельно
dotenv.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const clearDatabase = async () => {
    try {
        console.log("Connecting to database...");
        await (0, db_1.connectDB)();
        console.log("Connected to database successfully.");
        console.log("Clearing Users collection...");
        const userResult = await User_1.default.deleteMany({});
        console.log(`Deleted ${userResult.deletedCount} users.`);
        console.log("Clearing Posts collection...");
        const postResult = await Post_1.default.deleteMany({});
        console.log(`Deleted ${postResult.deletedCount} posts.`);
        console.log("Database cleared successfully!");
    }
    catch (error) {
        console.error("Error clearing database:", error);
    }
    finally {
        console.log("Disconnecting from database...");
        await mongoose_1.default.disconnect();
        console.log("Disconnected.");
        process.exit(0);
    }
};
clearDatabase();
