"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isAdmin;
function isAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Не авторизован" });
    }
    if (req.user.role < 2) {
        return res.status(403).json({ message: "Недостаточно прав" });
    }
    next();
}
