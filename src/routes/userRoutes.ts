import { Router, Request, Response, NextFunction } from "express";
import User from "../models/User";
import Post from "../models/Post";
import { auth } from "../middleware/auth";
import { AppError } from "../utils/handleError";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
    dest: uploadsDir,
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("posts", "_id title text createdAt likes liked author");

        if (!user) {
            return next(new AppError(404, "Пользователь не найден"));
        }

        res.json({
            id: user._id.toString(),
            username: user.username,
            visualName: user.visualName,
            bio: user.bio,
            followers: user.followers.length,
            followings: user.followings.length,
            avatar: user.avatar,
            posts: user.posts,
            role: user.role,
        });
    } catch (err) {
        next(err);
    }
});

router.patch("/me", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { visualName, bio, username } = req.body;

        const user = await User.findById(req.user!.id);
        if (!user) return next(new AppError(404, "Пользователь не найден"));

        if (username && username !== user.username) {
            const exist = await User.findOne({ username });
            if (exist) {
                return next(new AppError(409, "Username already used"));
            }
        }

        if (username) user.username = username;
        if (visualName) user.visualName = visualName;
        if (bio) user.bio = bio;

        await user.save();

        res.json(formatUser(user));
    } catch (err) {
        next(err);
    }
});

router.get("/:id/follow", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const meId = req.user!.id;
        const targetId = req.params.id;

        if (meId === targetId) {
            return res.json({ following: false });
        }

        const me = await User.findById(meId);
        if (!me) return next(new AppError(404, "Ваш аккаунт не найден"));

        const isFollowing = me.followings.some(
            (id) => id.toString() === targetId,
        );

        res.json({ following: isFollowing });
    } catch (err) {
        next(err);
    }
});

router.post("/:id/follow", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const meId = req.user!.id;
        const targetId = req.params.id;

        if (meId === targetId) {
            return next(new AppError(400, "Cannot follow yourself"));
        }

        const me = await User.findById(meId);
        if (!me) return next(new AppError(404, "Ваш аккаунт не найден"));

        const target = await User.findById(targetId);
        if (!target) return next(new AppError(404, "Пользователь не найден"));

        const already = me!.followings.some((id) => id.toString() === targetId);
        if (already) {
            me!.followings = me!.followings.filter(
                (id) => id.toString() !== targetId,
            );
            target.followers = target.followers.filter(
                (id) => id.toString() !== meId,
            );

            await me!.save();
            await target.save();

            return res.json({ following: false });
        } else {
            me!.followings.push(targetId as any);
            target.followers.push(meId as any);

            await me!.save();
            await target.save();

            return res.json({ following: true });
        }
    } catch (err) {
        next(err);
    }
});

router.get("/:id/followers", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id).populate(
            "followers",
            "username visualName avatar",
        );
        if (!user) return next(new AppError(404, "Пользователь не найден"));
        res.json(user.followers);
    } catch (err) {
        next(err);
    }
});

router.get("/:id/followings", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id).populate(
            "followings",
            "username visualName avatar",
        );
        if (!user) return next(new AppError(404, "Пользователь не найден"));
        res.json(user.followings);
    } catch (err) {
        next(err);
    }
});

router.get("/:id/posts", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ author: req.params.id })
            .populate("author", "username avatar _id")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const normalizePost = (post: any) => ({
            ...post,
            _id: post._id.toString(),
            author: post.author
                ? { ...post.author, _id: post.author._id.toString() }
                : null,
        });

        res.json(posts.map(normalizePost));
    } catch (err) {
        next(err);
    }
});

router.post(
    "/me/avatar",
    auth,
    upload.single("file"),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const fileData = req.file;
            if (!fileData) return next(new AppError(400, "Файл не загружен"));

            const user = await User.findById(req.user?.id);
            if (!user) return next(new AppError(404, "Пользователь не найден"));

            if (user.avatar && !user.avatar.startsWith("http")) {
                const oldPath = path.join(
                    process.cwd(),
                    "uploads",
                    path.basename(user.avatar),
                );
                fs.unlink(oldPath, (err) => {
                    if (err)
                        console.log(
                            "Не удалось удалить старую аватарку:",
                            err.message,
                        );
                });
            }

            const newAvatarPath = "/uploads/" + fileData.filename;

            user.avatar = newAvatarPath;
            await user.save();

            res.json({
                message: "Аватар обновлён!",
                avatar: newAvatarPath,
            });
        } catch (err) {
            next(err);
        }
    },
);

function formatUser(u: any) {
    return {
        id: u._id.toString(),
        username: u.username,
        visualName: u.visualName,
        bio: u.bio,
        followers: u.followers ? u.followers.length : 0,
        followings: u.followings ? u.followings.length : 0,
    };
}

export default router;
