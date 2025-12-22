"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Post_1 = __importDefault(require("../models/Post"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
router.get("/", auth_1.optionalAuth, async (req, res) => {
    try {
        const page = Number(req.params.page) || 1;
        const limit = Number(req.params.limit) || 10;
        const skip = (page - 1) * limit;
        if (!req.user) {
            const posts = await Post_1.default.find({})
                .populate("author", "name avatar _id")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
            return res.json(posts);
        }
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(401).json({
                error: "User not found"
            });
        }
        const likedPosts = await Post_1.default.find({ _id: { $in: user.likes } }).limit(5);
        const keywords = [...new Set(likedPosts.flatMap(p => p.title.split(/\W+/).concat(p.text.split(/\W+/)))
                .filter(word => word.length > 0))].slice(0, 10);
        let posts = [];
        if (keywords.length === 0) {
            posts = await Post_1.default.find({})
                .populate("author", "name avatar _id")
                .sort({ likes: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
        }
        else {
            posts = await Post_1.default.find({
                _id: { $nin: user.likes },
                $text: { $search: keywords.join(" ") }
            })
                .populate("author", "name avatar _id")
                .sort({ likes: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
        }
        res.json(posts);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Ошибка сервера " });
    }
});
exports.default = router;
