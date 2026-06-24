import { Router, Request, Response, NextFunction } from "express";
import { auth, optionalAuth } from "../middleware/auth";
import Comment from "../models/Comment";
import Post from "../models/Post";
import { AppError } from "../utils/handleError";

function normalizeComment(comment: any, currentUserId?: string | null) {
    const likedBy: any[] = comment.likedBy || [];
    const liked = currentUserId
        ? likedBy.some((id) => id.toString() === currentUserId)
        : false;

    const { likedBy: _omit, ...rest } = comment;

    return {
        ...rest,
        _id: comment._id.toString(),
        parent: comment.parent ? comment.parent.toString() : null,
        liked,
        author: comment.author
            ? {
                  ...comment.author,
                  _id: comment.author._id.toString(),
              }
            : null,
    };
}

const router = Router();

// Create a comment or reply
router.post("/:postId", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { text, parentId } = req.body;
        const { postId } = req.params;
        const authorId = req.user!.id;

        if (!text || !text.trim()) {
            return next(new AppError(400, "Текст комментария пуст"));
        }

        const post = await Post.findById(postId);
        if (!post) {
            return next(new AppError(404, "Пост не найден"));
        }

        let parent = null;
        if (parentId) {
            parent = await Comment.findById(parentId);
            if (!parent) {
                return next(new AppError(404, "Родительский комментарий не найден"));
            }
            if (parent.post.toString() !== postId) {
                return next(new AppError(400, "Комментарий принадлежит другому посту"));
            }
            if (parent.parent !== null) {
                return next(new AppError(400, "Нельзя отвечать на ответ"));
            }
        }

        const comment = new Comment({
            text,
            author: authorId,
            post: postId,
            parent: parentId || null,
        });

        await comment.save();

        post.commentsCount = post.commentsCount + 1;
        await post.save();

        const populated = await Comment.findById(comment._id)
            .populate("author", "username avatar _id")
            .lean();

        res.json(normalizeComment(populated, authorId));
    } catch (err) {
        next(err);
    }
});

// List top-level comments (paginated) with their replies nested
router.get("/:postId", optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const currentUserId = req.user ? req.user.id : null;

        const post = await Post.findById(postId);
        if (!post) {
            return next(new AppError(404, "Пост не найден"));
        }

        const topLevel = await Comment.find({ post: postId, parent: null })
            .populate("author", "username avatar _id")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const parentIds = topLevel.map((c) => c._id);
        const replies = await Comment.find({ parent: { $in: parentIds } })
            .populate("author", "username avatar _id")
            .sort({ createdAt: 1 })
            .lean();

        const repliesByParent: Record<string, any[]> = {};
        for (const reply of replies) {
            const key = reply.parent!.toString();
            if (!repliesByParent[key]) repliesByParent[key] = [];
            repliesByParent[key].push(normalizeComment(reply, currentUserId));
        }

        const result = topLevel.map((c) => ({
            ...normalizeComment(c, currentUserId),
            replies: repliesByParent[c._id.toString()] || [],
        }));

        res.json(result);
    } catch (err) {
        next(err);
    }
});

// Edit own comment
router.patch("/:id", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return next(new AppError(400, "Текст комментария пуст"));
        }

        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return next(new AppError(404, "Комментарий не найден"));
        }
        if (comment.author.toString() !== req.user!.id) {
            return next(new AppError(403, "Нельзя редактировать чужой комментарий"));
        }

        comment.text = text;
        comment.edited = true;
        await comment.save();

        const populated = await Comment.findById(comment._id)
            .populate("author", "username avatar _id")
            .lean();

        res.json(normalizeComment(populated, req.user!.id));
    } catch (err) {
        next(err);
    }
});

// Delete a comment (author / post author / moderator+); cascades replies
router.delete("/:id", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return next(new AppError(404, "Комментарий не найден"));
        }

        const post = await Post.findById(comment.post);
        const isAuthor = comment.author.toString() === req.user!.id;
        const isPostAuthor = post ? post.author.toString() === req.user!.id : false;
        const isModerator = req.user!.role >= 2;

        if (!isAuthor && !isPostAuthor && !isModerator) {
            return next(new AppError(403, "Недостаточно прав для удаления"));
        }

        let removed = 1;
        if (comment.parent === null) {
            const replies = await Comment.deleteMany({ parent: comment._id });
            removed += replies.deletedCount || 0;
        }

        await Comment.findByIdAndDelete(comment._id);

        if (post) {
            post.commentsCount = Math.max(0, post.commentsCount - removed);
            await post.save();
        }

        res.json({ message: "Комментарий удален" });
    } catch (err) {
        next(err);
    }
});

// Toggle like on a comment
router.post("/:id/like", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return next(new AppError(404, "Комментарий не найден"));
        }

        const userId = req.user!.id;
        if (comment.likedBy.some((id) => id.toString() === userId)) {
            comment.likes = Math.max(0, comment.likes - 1);
            comment.likedBy = comment.likedBy.filter((id) => id.toString() !== userId);
        } else {
            comment.likes = comment.likes + 1;
            comment.likedBy.push(req.user!.id as any);
        }

        await comment.save();

        res.json({ likes: comment.likes });
    } catch (err) {
        next(err);
    }
});

export default router;
