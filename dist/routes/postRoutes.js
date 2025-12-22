"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const Post_1 = __importDefault(require("../models/Post"));
const router = (0, express_1.Router)();
router.post("/", auth_1.auth, async (req, res) => {
    try {
        const { title, text } = req.body;
        const authorId = req.user.id;
        if (!title || !text || !authorId) {
            return res.status(400).json({
                error: "Не все данные перенесены",
            });
        }
        const author = await User_1.default.findById(authorId);
        if (!author) {
            return res.status(400).json({
                error: "Пользователь не найден"
            });
        }
        const post = new Post_1.default({
            title,
            text,
            authorId,
            createdAt: new Date(),
        });
        await post.save();
        author.posts.push(post._id);
        await author.save();
        res.json(post);
    }
    catch (err) {
        res.status(400).json({
            error: "Ошибка сервера"
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id).populate("author", "name avatar _id");
        if (!post) {
            return res.status(404).json({
                error: "Пост не найден"
            });
        }
        res.json(post);
    }
    catch (err) {
        res.status(500).json({
            error: "Ошибка сервера",
        });
    }
});
router.delete("/:id", auth_1.auth, async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                error: "Пост не найден",
            });
        }
        if (req.user.id !== post.author.id.toString() && req.user.id !== post.author._id.toString()) {
            return res.status(400).json({
                error: "Нельзя удалить чужой код"
            });
        }
        await User_1.default.updateOne({
            _id: post.author
        }, {
            $pull: {
                posts: post._id,
            }
        });
        res.json({
            message: "Пост удален"
        });
    }
    catch (err) {
        res.status(500).json({
            error: "Ошибка сервера"
        });
    }
});
router.get("/likes/:id", async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                error: "Не удалось найти пользователя"
            });
        }
        const posts = await Post_1.default.find({
            _id: {
                $in: user.likes,
            }
        }).populate("author", "name avatar _id");
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({
            error: "Ошибка севера",
        });
    }
});
router.get("/likes", async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).json({
                error: "Не передан id пользователя"
            });
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: "Пользователь не найден"
            });
        }
        const posts = Post_1.default.find({
            _id: {
                $in: user.likes,
            }
        }).populate("author", "name avatar _id");
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({
            error: "Ошибка сервера",
        });
    }
});
router.get("/followings", async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).json({
                error: "Не передан id пользователя"
            });
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: "Пользователь не найден"
            });
        }
        const posts = Post_1.default.find({
            author: {
                $in: user.followings,
            }
        }).populate("author", "name avatar _id");
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({
            error: "Ошибка сервера",
        });
    }
});
router.post("/:id/like", auth_1.auth, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({
                error: "Пост не найден"
            });
        }
        const userId = req.user.id;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: "Пользователь не найден"
            });
        }
        if (user.likes.includes(post._id)) {
            post.likes = post.likes - 1;
            user.likes.filter((id) => !id.equals(post._id));
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
        res.status(500).json({
            error: "Ошибка сервера"
        });
    }
});
exports.default = router;
