import { Request, Response, Router, NextFunction } from "express";
import { optionalAuth } from "../middleware/auth";
import Post from "../models/Post";
import User from "../models/User";
import { AppError } from "../utils/handleError";

const router = Router();

router.get("/", optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const normalizePost = (post: any) => ({
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
            const posts = await Post.find({})
                .populate("author", "username avatar _id")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return res.json(posts.map(normalizePost));
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new AppError(401, "Пользователь не найден"));
        }
        const likedPosts = await Post.find({ _id: { $in: user.likes } }).limit(
            5,
        );
        const keywords = [
            ...new Set(
                likedPosts
                    .flatMap((p) =>
                        p.title.split(/\W+/).concat(p.text.split(/\W+/)),
                    )
                    .filter((word) => word.length > 0),
            ),
        ].slice(0, 10);

        let posts = [];
        if (keywords.length === 0) {
            posts = await Post.find({})
                .populate("author", "username avatar _id")
                .sort({ likes: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
        } else {
            posts = await Post.find({
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
    } catch (err) {
        next(err);
    }
});

export default router;
