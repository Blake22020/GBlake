import { Request, Response, Router, NextFunction } from "express";
import { auth, isAdmin } from "../middleware/auth";
import User from "../models/User";
import Post from "../models/Post";
import { AppError } from "../utils/handleError";
import path from "path";
import fs from "fs";

const router = Router();

function escapeRegex(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

router.get(
    "/stats",
    auth,
    isAdmin,
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const [
                totalUsers,
                totalPosts,
                roleCounts,
                weekAgoUsers,
                weekAgoPosts,
            ] = await Promise.all([
                User.countDocuments(),
                Post.countDocuments(),
                User.aggregate([
                    { $group: { _id: "$role", count: { $sum: 1 } } },
                ]),
                User.countDocuments({
                    createdAt: {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    },
                }),
                Post.countDocuments({
                    createdAt: {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    },
                }),
            ]);

            const byRole: Record<number, number> = {
                "-1": 0,
                "0": 0,
                "1": 0,
                "2": 0,
                "3": 0,
            };
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
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/users",
    auth,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = Math.max(1, parseInt(String(req.query.page || "1")));
            const limit = Math.min(
                50,
                Math.max(1, parseInt(String(req.query.limit || "20"))),
            );
            const search = String(req.query.search || "").trim();

            const filter: Record<string, any> = {};
            if (search) {
                filter.$or = [
                    { username: { $regex: escapeRegex(search), $options: "i" } },
                    { visualName: { $regex: escapeRegex(search), $options: "i" } },
                ];
            }

            const [users, total] = await Promise.all([
                User.find(filter)
                    .select(
                        "_id username visualName email role avatar createdAt",
                    )
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
        } catch (err) {
            next(err);
        }
    },
);

router.post(
    "/promote/:id",
    auth,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const targetUser = await User.findById(req.params.id);
            if (!targetUser) {
                return next(new AppError(404, "Пользователь не найден"));
            }

            const user = await User.findById(req.user!.id);
            if (!user) {
                return next(new AppError(404, "Admin not found"));
            }

            const newRole = parseInt(req.body.role);

            if (![-1, 0, 1, 2, 3].includes(newRole)) {
                return next(new AppError(400, "Invalid role"));
            }

            if (targetUser.role >= req.user!.role || newRole > req.user!.role) {
                return next(
                    new AppError(
                        403,
                        "Нельзя повышать роль выше своей или чужой",
                    ),
                );
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

            if (newRole === 3) {
                return next(new AppError(400, "Нельзя повышать до создателя"));
            }

            targetUser.role = newRole;
            await targetUser.save();

            res.json({ message: "Роль обновлена", role: targetUser.role });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
