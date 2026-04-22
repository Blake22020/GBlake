import { Request, Response, Router } from "express";
import { auth, isAdmin } from "../middleware/auth";
import User from "../models/User";
import Post from "../models/Post";
import path from "path";
import fs from "fs";

const router = Router();

router.get(
    "/stats",
    auth,
    isAdmin,
    async (_req: Request, res: Response) => {
        try {
            const [totalUsers, totalPosts, roleCounts, weekAgoUsers, weekAgoPosts] =
                await Promise.all([
                    User.countDocuments(),
                    Post.countDocuments(),
                    User.aggregate([
                        { $group: { _id: "$role", count: { $sum: 1 } } },
                    ]),
                    User.countDocuments({
                        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                    }),
                    Post.countDocuments({
                        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                    }),
                ]);

            const byRole: Record<number, number> = { "-1": 0, "0": 0, "1": 0, "2": 0, "3": 0 };
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
        } catch {
            res.status(500).json({ message: "Ошибка сервера" });
        }
    },
);

router.get(
    "/users",
    auth,
    isAdmin,
    async (req: Request, res: Response) => {
        try {
            const page = Math.max(1, parseInt(String(req.query.page || "1")));
            const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || "20"))));
            const search = String(req.query.search || "").trim();

            const filter: Record<string, any> = {};
            if (search) {
                filter.$or = [
                    { username: { $regex: search, $options: "i" } },
                    { visualName: { $regex: search, $options: "i" } },
                ];
            }

            const [users, total] = await Promise.all([
                User.find(filter)
                    .select("_id username visualName email role avatar createdAt")
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean(),
                User.countDocuments(filter),
            ]);

            res.json({
                users,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            });
        } catch {
            res.status(500).json({ message: "Ошибка сервера" });
        }
    },
);

router.post(
    "/promote/:id",
    auth,
    isAdmin,
    async (req: Request, res: Response) => {
        try {
            const targetUser = await User.findById(req.params.id);
            if (!targetUser) {
                return res.status(404).json({ message: "User not found" });
            }

            const user = await User.findById(req.user!.id);
            if (!user) {
                return res.status(404).json({ message: "Admin not found" });
            }

            const newRole = parseInt(req.body.role);

            if (![-1, 0, 1, 2, 3].includes(newRole)) {
                return res.status(400).json({ message: "Invalid role" });
            }

            if (targetUser.role >= req.user!.role || newRole > req.user!.role) {
                return res.status(403).json({
                    message: "Нельзя повышать роль выше своей или чужой",
                });
            }

            if (newRole === -1) {
                await Post.deleteMany({ author: targetUser._id });

                await User.updateMany(
                    { followings: targetUser._id },
                    { $pull: { followings: targetUser._id } },
                );

                await User.updateMany(
                    { followers: targetUser._id },
                    { $pull: { followers: targetUser._id } },
                );

                if (
                    targetUser.avatar &&
                    !targetUser.avatar.startsWith("http")
                ) {
                    const avatarPath = path.join(
                        process.cwd(),
                        targetUser.avatar,
                    );
                    fs.unlink(avatarPath, (err) => {
                        if (err)
                            console.log(
                                "Ошибка удаления аватара: ",
                                err.message,
                            );
                    });
                }

                await User.findByIdAndDelete(targetUser._id);

                return res.json({ message: "Пользователь забанен и удалён" });
            }

            if (![0, 1, 2, 3].includes(newRole)) {
                return res.status(400).json({ message: "Invalid role" });
            }

            if (newRole === 3) {
                return res
                    .status(400)
                    .json({ message: "Нельзя повышать до создателя" });
            }

            targetUser.role = newRole;
            await targetUser.save();

            res.json({ message: "Роль обновлена ", role: targetUser.role });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера" });
        }
    },
);

export default router;
