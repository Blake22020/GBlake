"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const auth_1 = require("../middleware/auth");
const handleError_1 = require("../utils/handleError");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
const uploadsDir = path_1.default.join(process.cwd(), "uploads");
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const upload = (0, multer_1.default)({
    dest: uploadsDir,
});
router.get("/:id", async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id)
            .select("-password")
            .populate("posts", "_id title text createdAt likes liked author");
        if (!user) {
            return next(new handleError_1.AppError(404, "Пользователь не найден"));
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
    }
    catch (err) {
        next(err);
    }
});
router.patch("/me", auth_1.auth, async (req, res, next) => {
    try {
        const { visualName, bio, username } = req.body;
        const user = await User_1.default.findById(req.user.id);
        if (!user)
            return next(new handleError_1.AppError(404, "Пользователь не найден"));
        if (username && username !== user.username) {
            const exist = await User_1.default.findOne({ username });
            if (exist) {
                return next(new handleError_1.AppError(409, "Username already used"));
            }
        }
        if (username)
            user.username = username;
        if (visualName)
            user.visualName = visualName;
        if (bio)
            user.bio = bio;
        await user.save();
        res.json(formatUser(user));
    }
    catch (err) {
        next(err);
    }
});
router.get("/:id/follow", auth_1.auth, async (req, res, next) => {
    try {
        const meId = req.user.id;
        const targetId = req.params.id;
        if (meId === targetId) {
            return res.json({ following: false });
        }
        const me = await User_1.default.findById(meId);
        if (!me)
            return next(new handleError_1.AppError(404, "Ваш аккаунт не найден"));
        const isFollowing = me.followings.some((id) => id.toString() === targetId);
        res.json({ following: isFollowing });
    }
    catch (err) {
        next(err);
    }
});
router.post("/:id/follow", auth_1.auth, async (req, res, next) => {
    try {
        const meId = req.user.id;
        const targetId = req.params.id;
        if (meId === targetId) {
            return next(new handleError_1.AppError(400, "Cannot follow yourself"));
        }
        const me = await User_1.default.findById(meId);
        if (!me)
            return next(new handleError_1.AppError(404, "Ваш аккаунт не найден"));
        const target = await User_1.default.findById(targetId);
        if (!target)
            return next(new handleError_1.AppError(404, "Пользователь не найден"));
        const already = me.followings.some((id) => id.toString() === targetId);
        if (already) {
            me.followings = me.followings.filter((id) => id.toString() !== targetId);
            target.followers = target.followers.filter((id) => id.toString() !== meId);
            await me.save();
            await target.save();
            return res.json({ following: false });
        }
        else {
            me.followings.push(targetId);
            target.followers.push(meId);
            await me.save();
            await target.save();
            return res.json({ following: true });
        }
    }
    catch (err) {
        next(err);
    }
});
router.get("/:id/followers", async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id).populate("followers", "username visualName avatar");
        if (!user)
            return next(new handleError_1.AppError(404, "Пользователь не найден"));
        res.json(user.followers);
    }
    catch (err) {
        next(err);
    }
});
router.get("/:id/followings", async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id).populate("followings", "username visualName avatar");
        if (!user)
            return next(new handleError_1.AppError(404, "Пользователь не найден"));
        res.json(user.followings);
    }
    catch (err) {
        next(err);
    }
});
router.get("/:id/posts", async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const posts = await Post_1.default.find({ author: req.params.id })
            .populate("author", "username avatar _id")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const normalizePost = (post) => ({
            ...post,
            _id: post._id.toString(),
            author: post.author
                ? { ...post.author, _id: post.author._id.toString() }
                : null,
        });
        res.json(posts.map(normalizePost));
    }
    catch (err) {
        next(err);
    }
});
router.post("/me/avatar", auth_1.auth, upload.single("file"), async (req, res, next) => {
    try {
        const fileData = req.file;
        if (!fileData)
            return next(new handleError_1.AppError(400, "Файл не загружен"));
        const user = await User_1.default.findById(req.user?.id);
        if (!user)
            return next(new handleError_1.AppError(404, "Пользователь не найден"));
        if (user.avatar && !user.avatar.startsWith("http")) {
            const oldPath = path_1.default.join(process.cwd(), "uploads", path_1.default.basename(user.avatar));
            fs_1.default.unlink(oldPath, (err) => {
                if (err)
                    console.log("Не удалось удалить старую аватарку:", err.message);
            });
        }
        const newAvatarPath = "/uploads/" + fileData.filename;
        user.avatar = newAvatarPath;
        await user.save();
        res.json({
            message: "Аватар обновлён!",
            avatar: newAvatarPath,
        });
    }
    catch (err) {
        next(err);
    }
});
function formatUser(u) {
    return {
        id: u._id.toString(),
        username: u.username,
        visualName: u.visualName,
        bio: u.bio,
        followers: u.followers ? u.followers.length : 0,
        followings: u.followings ? u.followings.length : 0,
    };
}
exports.default = router;
