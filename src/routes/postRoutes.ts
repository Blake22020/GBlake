import { Router, Request, Response } from "express";
import User from "../models/User";
import { auth } from "../middleware/auth";
import Post from "../models/Post";

function normalizePost(post: any) {
    return {...post,
    _id: post._id.toString(),
    author: post.author
        ? {
            ...post.author,
            _id: post.author._id.toString(),
        } : null,
    };
};

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
            author: authorId,
        })


        await post.save();

        author.posts.push(post._id);
        await author.save();

        res.json(normalizePost(post))
    } catch (err) {
        res.status(400).json({
            error: "Ошибка сервера"
        })
    }
})

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "username avatar _id");
        if (!post) {
            return res.status(404).json({
                error: "Пост не найден"
            })
        }

        const normalizePost = (post: any) => ({
            ...post,
            _id: post._id.toString(),
            author: post.author
                ? {
                    ...post.author,
                    _id: post.author._id.toString(),
                } : null,
        });

        res.json(normalizePost(post))
    } catch (err) {
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }   
})

router.delete("/:id", auth, async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                error: "Пост не найден",
            })
        }


        if (req.user!.id !== post.author.toString()) {
            return res.status(400).json({
                error: "Нельзя удалить чужой пост"
            })
        }

        await User.updateOne({
                _id: post.author
            },
            {
                $pull: {
                    posts: post._id,
                }
            }
        )

        await Post.findByIdAndDelete(req.params.id);

        res.json({
            message: "Пост удален"
        })
    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера"
        })
    }
})


router.get("/likes", async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;
        if(!userId) {
            return res.status(400).json({
                error: "Не передан id пользователя"
            })
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: "Пользователь не найден"
            })
        }

        const posts = await Post.find({
            _id: {
                $in: user.likes,
            }
        }).populate("author", "username avatar _id");


        res.json(posts.map(normalizePost))    
    } 
        catch(err) {
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }
})

router.get("/followings", async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;
        if(!userId) {
            return res.status(400).json({
                error: "Не передан id пользователя"
            })
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({    
                error: "Пользователь не найден"
            })
        }

        const posts = await Post.find({
            author: {
                $in: user.followings,
            }
        }).populate("author", "username avatar _id");


        res.json(posts.map(normalizePost));
    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }
})

router.post("/:id/like", auth, async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({
                error: "Пост не найден"
            })
        }
        const userId = req.user!.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: "Пользователь не найден"
            })
        }
        if(user.likes.includes(post._id)) {
            post.likes = post.likes - 1;
            user.likes = user.likes.filter((id) => !id.equals(post._id));
        } else {
            post.likes = post.likes + 1;
            user.likes.push(post._id)
        }

        await post.save()
        await user.save();

        res.json({ likes: post.likes })
    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера"
        })
    }
})

export default router;