import { Request, Response, Router } from 'express';
import User from '../models/User';
import Post from "../models/Post";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        let { q } = req.query;
        if(!q) {
            return res.status(404).json({
                error: "Не передан поисковый запрос"
            })
        }

        if (Array.isArray(q)) {
            q = q[0];
        }

        if(typeof q !== "string") {
            q = String(q)
        }

        const users = await User.find({
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

        const posts = await Post.find({
            $or: [
                { title: {$regex: q, $options: "i" } },
                { text: {$regex: q, $options: "i" } },
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
        }))

        formatedUsers.sort((a, b) => {
            return (b.followers.length || 0) - (a.followers.length || 0);
        })

        formatedPosts.sort((a, b) => {
            return (b.likes || 0) - (a.likes || 0);
        })

        return res.json({
            users,
            posts
        })


    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера",
        });
    }
})

export default router;