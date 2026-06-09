"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
async function connectDB() {
    try {
        const conn = await mongoose_1.default.connect(env_1.env.mongoUrl, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host} =)`);
    }
    catch (e) {
        console.error("DB ERROR: ", e);
        console.log("Retrying in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
}
