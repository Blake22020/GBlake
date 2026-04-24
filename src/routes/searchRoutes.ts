import { Request, Response, Router, NextFunction } from "express";
import User from "../models/User";
import Post from "../models/Post";
import { AppError } from "../utils/handleError";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { q } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!q) {
            return next(new AppError(400, "Не передан поисковый запрос"));
        }

        if (Array.isArray(q)) {
            q = q[0];
        }

        if (typeof q !== "string") {
            q = String(q);
        }

        const users = await User.find({
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

        const posts = await Post.find({
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
    } catch (err) {
        next(err);
    }
});

export default router;
