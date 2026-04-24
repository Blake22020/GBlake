"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const Post_1 = __importDefault(require("../models/Post"));
const handleError_1 = require("../utils/handleError");
function normalizePost(post) {
    return {
        ...post,
        _id: post._id.toString(),
        author: post.author
            ? {
                ...post.author,
                _id: post.author._id.toString(),
            }
            : null,
    };
}
const router = (0, express_1.Router)();
router.post("/", auth_1.auth, async (req, res, next) => {
    try {
        const { title, text } = req.body;
        const authorId = req.user.id;
        if (!title || !text) {
            return next(new handleError_1.AppError(400, "Не все данные перенесены"));
        }
        const author = await User_1.default.findById(authorId);
        if (!author) {
            return next(new handleError_1.AppError(404, "Пользователь не найден"));
        }
        const post = new Post_1.default({
            title,
            text,
            author: authorId,
        });
        await post.save();
        author.posts.push(post._id);
        await author.save();
        const populatedPost = await Post_1.default.findById(post._id)
            .populate("author", "username avatar _id")
            .lean();
        res.json(normalizePost(populatedPost));
    }
    catch (err) {
        next(err);
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        const post = await Post_1.default.findById(req.params.id).populate("author", "username avatar _id");
        if (!post) {
            return next(new handleError_1.AppError(404, "Пост не найден"));
        }
        const normalizePost = (post) => ({
            ...post,
            _id: post._id.toString(),
            author: post.author
                ? {
                    ...post.author,
                    _id: post.author._id.toString(),
                }
                : null,
        });
        res.json(normalizePost(post));
    }
    catch (err) {
        next(err);
    }
});
router.delete("/:id", auth_1.auth, async (req, res, next) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (!post) {
            return next(new handleError_1.AppError(404, "Пост не найден"));
        }
        if (req.user.id !== post.author.toString()) {
            return next(new handleError_1.AppError(403, "Нельзя удалить чужой пост"));
        }
        await User_1.default.updateOne({ _id: post.author }, { $pull: { posts: post._id } });
        await User_1.default.updateMany({ likes: post._id }, { $pull: { likes: post._id } });
        await Post_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: "Пост удален" });
    }
    catch (err) {
        next(err);
    }
});
router.get("/likes", auth_1.auth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return next(new handleError_1.AppError(404, "Пользователь не найден"));
        }
        const posts = await Post_1.default.find({
            _id: { $in: user.likes },
        })
            .populate("author", "username avatar _id")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.json(posts.map(normalizePost));
    }
    catch (err) {
        next(err);
    }
});
router.get("/followings", auth_1.auth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return next(new handleError_1.AppError(404, "Пользователь не найден"));
        }
        const posts = await Post_1.default.find({
            author: { $in: user.followings },
        })
            .populate("author", "username avatar _id")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.json(posts.map(normalizePost));
    }
    catch (err) {
        next(err);
    }
});
router.post("/:id/like", auth_1.auth, async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post_1.default.findById(postId);
        if (!post) {
            return next(new handleError_1.AppError(404, "Пост не найден"));
        }
        const userId = req.user.id;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return next(new handleError_1.AppError(404, "Пользователь не найден"));
        }
        if (user.likes.some((id) => id.equals(post._id))) {
            post.likes = post.likes - 1;
            user.likes = user.likes.filter((id) => !id.equals(post._id));
        }
        else {
            post.likes = post.likes + 1;
            user.likes.push(post._id);
        }
        await post.save();
        await user.save();
        res.json({ likes: post.likes });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
