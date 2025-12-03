import { Router, Request, Response } from "express";
import User from "../models/User";
import { auth } from "../middleware/auth";
import multer from "multer";
import Post from "../models/Post";


const router = Router();


router.post("/", auth, async (req: Request, res: Response) => {
    try {
        const { title, text } = req.body;
        const authorId = req.user!.id;
        if(!title || !text || !authorId) {
            return res.status(400).json({
                error: "Не все данные перенесены",
            })
        }

        const author = await User.findById(authorId);
        if(!author) {
            return res.status(400).json({
                error: "Пользователь не найден"
            })
        }

        const post = new Post({
            title,
            text,
            authorId,
            createdAt: new Date(),
        })


        await post.save();

        author.posts.push(post._id);
        await author.save();

        res.json(post)
    } catch (err) {
        res.status(400).json({
            error: "Ошибка сервера"
        })
    }
})

router.get("/api/posts/:id", async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "name avatar _id");
        if (!post) {
            return res.status(404).json({
                error: "Пост не найден"
            })
        }

        res.json(post)
    } catch (err) {
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }
})