"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.optionalAuth = optionalAuth;
exports.isAdmin = isAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const env_1 = require("../config/env");
async function auth(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ ok: false, message: "No token" });
        }
        const token = header.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        const user = await User_1.default.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ ok: false, message: "User not found" });
        }
        req.user = {
            id: user._id.toString(),
            role: user.role
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ ok: false, message: "Invalid token" });
    }
}
async function optionalAuth(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            req.user = null;
            return next();
        }
        const token = header.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        const user = await User_1.default.findById(decoded.id);
        req.user = user ? {
            id: user._id.toString(),
            role: user.role
        } : null;
        next();
    }
    catch {
        req.user = null;
        next();
    }
}
async function isAdmin(req, res, next) {
    if (req.user.role < 2) {
        return res.status(403).json({ ok: false, message: "Доступ запрещён" });
    }
    next();
}
