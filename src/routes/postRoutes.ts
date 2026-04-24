import { Router, Request, Response, NextFunction } from "express";
import User from "../models/User";
import { auth } from "../middleware/auth";
import Post from "../models/Post";
import { AppError } from "../utils/handleError";

function normalizePost(post: any) {
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

const router = Router();

router.post("/", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, text } = req.body;
        const authorId = req.user!.id;
        if (!title || !text) {
            return next(new AppError(400, "Не все данные перенесены"));
        }

        const author = await User.findById(authorId);
        if (!author) {
            return next(new AppError(404, "Пользователь не найден"));
        }

        const post = new Post({
            title,
            text,
            author: authorId,
        });

        await post.save();

        author.posts.push(post._id);
        await author.save();

        const populatedPost = await Post.findById(post._id)
            .populate("author", "username avatar _id")
            .lean();

        res.json(normalizePost(populatedPost));
    } catch (err) {
        next(err);
    }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findById(req.params.id).populate(
            "author",
            "username avatar _id",
        );
        if (!post) {
            return next(new AppError(404, "Пост не найден"));
        }

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

        res.json(normalizePost(post));
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return next(new AppError(404, "Пост не найден"));
        }

        if (req.user!.id !== post.author.toString()) {
            return next(new AppError(403, "Нельзя удалить чужой пост"));
        }

        await User.updateOne(
            { _id: post.author },
            { $pull: { posts: post._id } },
        );

        await User.updateMany(
            { likes: post._id },
            { $pull: { likes: post._id } },
        );

        await Post.findByIdAndDelete(req.params.id);

        res.json({ message: "Пост удален" });
    } catch (err) {
        next(err);
    }
});

router.get("/likes", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError(404, "Пользователь не найден"));
        }

        const posts = await Post.find({
            _id: { $in: user.likes },
        })
            .populate("author", "username avatar _id")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json(posts.map(normalizePost));
    } catch (err) {
        next(err);
    }
});

router.get("/followings", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError(404, "Пользователь не найден"));
        }

        const posts = await Post.find({
            author: { $in: user.followings },
        })
            .populate("author", "username avatar _id")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json(posts.map(normalizePost));
    } catch (err) {
        next(err);
    }
});

router.post("/:id/like", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new AppError(404, "Пост не найден"));
        }
        const userId = req.user!.id;

        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError(404, "Пользователь не найден"));
        }
        if (user.likes.some((id) => id.equals(post._id))) {
            post.likes = post.likes - 1;
            user.likes = user.likes.filter((id) => !id.equals(post._id));
        } else {
            post.likes = post.likes + 1;
            user.likes.push(post._id);
        }

        await post.save();
        await user.save();

        res.json({ likes: post.likes });
    } catch (err) {
        next(err);
    }
});

export default router;
