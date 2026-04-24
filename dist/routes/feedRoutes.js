"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Post_1 = __importDefault(require("../models/Post"));
const User_1 = __importDefault(require("../models/User"));
const handleError_1 = require("../utils/handleError");
const router = (0, express_1.Router)();
router.get("/", auth_1.optionalAuth, async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
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
        if (!req.user) {
            const posts = await Post_1.default.find({})
                .populate("author", "username avatar _id")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
            return res.json(posts.map(normalizePost));
        }
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            return next(new handleError_1.AppError(401, "Пользователь не найден"));
        }
        const likedPosts = await Post_1.default.find({ _id: { $in: user.likes } }).limit(5);
        const keywords = [
            ...new Set(likedPosts
                .flatMap((p) => p.title.split(/\W+/).concat(p.text.split(/\W+/)))
                .filter((word) => word.length > 0)),
        ].slice(0, 10);
        let posts = [];
        if (keywords.length === 0) {
            posts = await Post_1.default.find({})
                .populate("author", "username avatar _id")
                .sort({ likes: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
        }
        else {
            posts = await Post_1.default.find({
                _id: { $nin: user.likes },
                $text: { $search: keywords.join(" ") },
            })
                .populate("author", "username avatar _id")
                .sort({ likes: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
        }
        res.json(posts.map(normalizePost));
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
