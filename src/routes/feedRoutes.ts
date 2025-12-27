import {Request, Response, Router} from "express";
import { optionalAuth } from "../middleware/auth"
import Post from "../models/Post";
import User from "../models/User";

const router = Router();

router.get("/", optionalAuth, async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;


        if(!req.user) {
            const posts = await Post.find({})
                .populate("author", "name avatar _id")
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limit)
                .lean();

            return res.json(posts);
        }

        const user = await User.findById(req.user.id)
        if(!user) {
            return res.status(401).json({
                error: "User not found"
            })
        }
        const likedPosts = await Post.find({ _id: { $in: user.likes}}).limit(5);
        const keywords = [...new Set(
            likedPosts.flatMap(p => p.title.split(/\W+/).concat(p.text.split(/\W+/)))
                .filter(word => word.length > 0)
        )].slice(0, 10);

        let posts = [];
        if(keywords.length === 0) {
            posts = await Post.find({})
                .populate("author", "name avatar _id")
                .sort({likes: -1, createdAt: -1})
                .skip(skip)
                .limit(limit)
                .lean();
        } else {
            posts = await Post.find({
                _id: { $nin: user.likes },
                $text: { $search: keywords.join(" ") }
            })
                .populate("author", "name avatar _id")
                .sort({likes: -1, createdAt: -1})
                .skip(skip)
                .limit(limit)
                .lean();
        }

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Ошибка сервера "})
    }
})

export default router