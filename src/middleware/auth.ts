import { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { env } from "../config/env";

export async function auth(req: Request, res: Response, next: NextFunction) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ ok: false, message: "No token" });
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, env.jwtSecret) as {id: string, role: number};

        const user =  await User.findById(decoded.id)
        if (!user) {
            return res.status(401).json({ ok: false, message: "User not found" });
        }

        req.user = {
            id: user._id.toString(),
            role: user.role
        }
        next()
    } catch (error) {
        return res.status(401).json({ ok: false, message: "Invalid token" });
    }
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            req.user = null;
            return next();
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, env.jwtSecret) as {
            id: string;
            role: number;
        };

        const user = await User.findById(decoded.id);
        req.user = user ? {
            id: user._id.toString(),
            role: user.role
        } : null;

        next();
    } catch {
        req.user = null;
        next();
    }
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.user!.role < 2) {
        return res.status(403).json({ ok: false, message: "Доступ запрещён" });
    }
    next();
}