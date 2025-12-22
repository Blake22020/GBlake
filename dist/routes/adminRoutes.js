"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
router.post("/promote/:id", auth_1.auth, auth_1.isAdmin, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const targetUser = await User_1.default.findById(req.user.id);
        if (!targetUser) {
            return res.status(404).json({ error: "User not found" });
        }
        const newRole = parseInt(req.body.role);
        if (![-1, 0, 1, 2, 3].includes(newRole)) {
            return res.status(400).json({ error: "Invalid role" });
        }
        if (targetUser.role >= req.user.role || (newRole !== -1 && newRole > req.user.role)) {
            return res.status(403).json({
                error: "Нельзя повышать роль выше своей или чужой"
            });
        }
        if (newRole === -1) {
            await Post_1.default.deleteMany({ author: targetUser._id });
            await User_1.default.updateMany({ followings: targetUser._id }, { $pull: { followers: targetUser._id } });
            if (targetUser.avatar && !targetUser.avatar.startsWith("http")) {
                const avatarPath = path_1.default.join(__dirname, targetUser.avatar);
                fs_1.default.unlink(avatarPath, (err) => {
                    if (err)
                        console.log("Ошибка удаления аватара: ", err.message);
                });
            }
            await User_1.default.findByIdAndDelete(targetUser._id);
            return res.json({ message: "Пользователь забанен и удалён" });
        }
        if (![0, 1, 2, 3].includes(newRole)) {
            return res.status(400).json({ error: "Invalid role" });
        }
        if (newRole === 3) {
            return res.status(400).json({ error: "Нельзя повышать до создателя" });
        }
        targetUser.role = newRole;
        await targetUser.save();
        res.json({ message: "Роль обновлена ", role: targetUser.role });
    }
    catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});
exports.default = router;
