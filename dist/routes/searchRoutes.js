"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const handleError_1 = require("../utils/handleError");
const router = (0, express_1.Router)();
router.get("/", async (req, res, next) => {
    try {
        let { q } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        if (!q) {
            return next(new handleError_1.AppError(400, "Не передан поисковый запрос"));
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
            ],
        })
            .select("_id username visualName avatar followers posts")
            .lean();
        const formatedUsers = users.map((user) => ({
            _id: user._id.toString(),
            visualName: user.visualName,
            followers: user.followers.length,
            avatar: user.avatar,
        }));
        const posts = await Post_1.default.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { text: { $regex: q, $options: "i" } },
            ],
        })
            .populate("author", "username avatar _id")
            .select("title text author createdAt _id likes")
            .lean();
        const formatedPosts = posts.map((post) => ({
            _id: post._id.toString(),
            likes: post.likes,
            title: post.title,
            text: post.text,
            createdAt: post.createdAt,
            author: post.author,
        }));
        formatedUsers.sort((a, b) => {
            return (b.followers || 0) - (a.followers || 0);
        });
        formatedPosts.sort((a, b) => {
            return (b.likes || 0) - (a.likes || 0);
        });
        const paginatedUsers = formatedUsers.slice(skip, skip + limit);
        const paginatedPosts = formatedPosts.slice(skip, skip + limit);
        return res.json({
            users: paginatedUsers,
            posts: paginatedPosts,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
