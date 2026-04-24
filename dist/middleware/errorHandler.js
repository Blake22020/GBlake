"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const handleError_1 = require("../utils/handleError");
function errorHandler(err, _req, res, _next) {
    if (err instanceof handleError_1.AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
}
