import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/handleError';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
}
