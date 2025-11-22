import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env'

export default function verifyToken(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(400).json({ message: 'Нет токена' });
    }

    const [type, token] = header.split(' ');
    if(type != 'Bearer' || !token) {
        return res.status(400).json({ message: 'Неверный формат токена' });
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret) as { id: string, role: number };

        req.user = {
            id: decoded.id as any,
            role: decoded.role,
        }
        next();
    } catch {
        res.status(400).json({ message: 'Неверный или истекший токен' });
    }
}