"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const required = [
    'MONGO_URL',
    'CREATOR',
    'PORT',
    'JWT_SECRET'
];
required.forEach((require) => {
    if (!process.env[require]) {
        console.error(`Missing env variable: ${require}`);
        process.exit(1);
    }
});
exports.env = {
    mongoUrl: process.env.MONGO_URL,
    creator: process.env.CREATOR,
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
};
