"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    try {
        let { q } = req.query;
        if (!q) {
            return res.status(404).json({
                error: "Не передан поисковый запрос"
            });
        }
        if (Array.isArray(q)) {
            q = q[0];
        }
        if (typeof q !== "string") {
            q = String(q);
        }
        const users = await User_1.default.find({
            $or: [
                { visualName: { $regex: q, $options: "i" } },
                { bio: { $regex: q, $options: "i" } },
                { username: { $regex: q, $options: "i" } },
            ]
        }).select("_id name avatar posts").lean();
        const formatedUsers = users.map((user) => ({
            type: "user",
            _id: user._id,
            visualName: user.visualName,
            bio: user.bio,
            followers: user.followers,
            avatar: user.avatar,
            posts: user.posts ? user.posts.length : 0,
        }));
        const posts = await Post_1.default.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { text: { $regex: q, $options: "i" } },
            ]
        })
            .populate("author", "name avatar _id")
            .select("title text author createdAt _id")
            .lean();
        const formatedPosts = posts.map((post) => ({
            type: "post",
            _id: post._id,
            likes: post.likes,
            title: post.title,
            text: post.text,
            createdAt: post.createdAt,
            author: post.author,
        }));
        formatedUsers.sort((a, b) => {
            return (b.followers.length || 0) - (a.followers.length || 0);
        });
        formatedPosts.sort((a, b) => {
            return (b.likes || 0) - (a.likes || 0);
        });
        return res.json({
            users,
            posts
        });
    }
    catch (err) {
        res.status(500).json({
            error: "Ошибка сервера",
        });
    }
});
exports.default = router;
