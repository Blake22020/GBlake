"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const handleError_1 = require("../utils/handleError");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
router.get("/stats", auth_1.auth, auth_1.isAdmin, async (_req, res, next) => {
    try {
        const [totalUsers, totalPosts, roleCounts, weekAgoUsers, weekAgoPosts] = await Promise.all([
            User_1.default.countDocuments(),
            Post_1.default.countDocuments(),
            User_1.default.aggregate([
                { $group: { _id: "$role", count: { $sum: 1 } } },
            ]),
            User_1.default.countDocuments({
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            }),
            Post_1.default.countDocuments({
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            }),
        ]);
        const byRole = { "-1": 0, "0": 0, "1": 0, "2": 0, "3": 0 };
        for (const entry of roleCounts) {
            byRole[entry._id] = entry.count;
        }
        res.json({
            totalUsers,
            totalPosts,
            newUsersThisWeek: weekAgoUsers,
            newPostsThisWeek: weekAgoPosts,
            byRole,
        });
    }
    catch (err) {
        next(err);
    }
});
router.get("/users", auth_1.auth, auth_1.isAdmin, async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(String(req.query.page || "1")));
        const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || "20"))));
        const search = String(req.query.search || "").trim();
        const filter = {};
        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: "i" } },
                { visualName: { $regex: search, $options: "i" } },
            ];
        }
        const [users, total] = await Promise.all([
            User_1.default.find(filter)
                .select("_id username visualName email role avatar createdAt")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            User_1.default.countDocuments(filter),
        ]);
        res.json({
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (err) {
        next(err);
    }
});
router.post("/promote/:id", auth_1.auth, auth_1.isAdmin, async (req, res, next) => {
    try {
        const targetUser = await User_1.default.findById(req.params.id);
        if (!targetUser) {
            return next(new handleError_1.AppError(404, "Пользователь не найден"));
        }
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            return next(new handleError_1.AppError(404, "Admin not found"));
        }
        const newRole = parseInt(req.body.role);
        if (![-1, 0, 1, 2, 3].includes(newRole)) {
            return next(new handleError_1.AppError(400, "Invalid role"));
        }
        if (targetUser.role >= req.user.role || newRole > req.user.role) {
            return next(new handleError_1.AppError(403, "Нельзя повышать роль выше своей или чужой"));
        }
        if (newRole === -1) {
            await Post_1.default.deleteMany({ author: targetUser._id });
            await User_1.default.updateMany({ followings: targetUser._id }, { $pull: { followings: targetUser._id } });
            await User_1.default.updateMany({ followers: targetUser._id }, { $pull: { followers: targetUser._id } });
            if (targetUser.avatar &&
                !targetUser.avatar.startsWith("http")) {
                const avatarPath = path_1.default.join(process.cwd(), targetUser.avatar);
                fs_1.default.unlink(avatarPath, (err) => {
                    if (err)
                        console.log("Ошибка удаления аватара: ", err.message);
                });
            }
            await User_1.default.findByIdAndDelete(targetUser._id);
            return res.json({ message: "Пользователь забанен и удалён" });
        }
        if (newRole === 3) {
            return next(new handleError_1.AppError(400, "Нельзя повышать до создателя"));
        }
        targetUser.role = newRole;
        await targetUser.save();
        res.json({ message: "Роль обновлена", role: targetUser.role });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
