import { Request, Response, NextFunction } from 'express';

export default function isAdmin(req: Request, res: Response, next: NextFunction) {
    if(!req.user) {
        return res.status(401).json( { message: "Не авторизован" } );
    }

    if (req.user.role < 2) {
        return res.status(403).json( { message: "Недостаточно прав" } );
    }

    next()
}