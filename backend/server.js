const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');


require('dotenv').config();

const Schema = mongoose.Schema;
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

const uploads = multer({ storage });

mongoose.connect("mongodb://localhost:27017/social", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const userSchema = new Schema({
    name: {
        type: String,
        default: "Новый пользователь",
        minlength:3,
        maxlength:20
    },
    bio: {
        type: String,
        default: "...",
        minlength:3,
        maxlength:40
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        default: []
    }],
    followings: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }], 
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        minlength:3,
    },

    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            default: [],
        }
    ],

    role: {
        type: Number,
        default: 0,
        enum: [0, 1, 2, 3]
    }
})
const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength:1,
        maxlength:20
    },
    text: {
        type: String,
        required: true,
        default: "",
        minlength:1,
        maxlength:40
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    likes: {
        type: Number,
        default: 0,
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

function isAdmin(req, res, next) {
    if (req.user.role < 2) {
        return res.status(403).json({ error: "Доступ запрещён" });
    }
    next();
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token) {
        return res.status(401).json({
            error: "Пользователь не авторизован",
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        res.status(403).json({
            error: "Неверный токен",
        })
    }
}

app.post("/api/users/register", async (req, res) => {
    try {
        const {email, password} = req.body;
        const excistingUser = await User.findOne({email});

        if (excistingUser) {
            return res.status(400).json({
                error: "Пользователь с таким email уже существует.",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = email === "your-email@example.com" ? 3 : 0;

        const newUser = new User({email, password: hashedPassword, role});

        await newUser.save();

        const token = jwt.sign(
            {id: newUser._id},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN },
        );

        res.status(201).json({
            message: "Пользователь создан!",
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                avatar: newUser.avatar,
                role: newUser.role,
            },
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }
})

app.post("/api/users/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) {
            return res.status(404).json({
                error: "Пользователь не найден",
            })
        }

        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) {
            return res.status(401).json({
                error: "Неверный пароль",
            })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN },
        )

        res.json({
            message: "Пользователь авторизован!",
            token,
            user: {
                _id: user._id,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
            },
        })
    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }
})

app.get("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("posts");
        if (!user) {
            return res.status(404).json({
                error: "Пользователь не найден",
            })
        }
        res.json(user)
    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера",
        });
    }
})

app.post("/api/users/:id/promote", verifyToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "Пользователь не найден" });

        const newRole = parseInt(req.body.role);
        
        if (![0, 1, 2, 3].includes(newRole)) {
            return res.status(400).json({
                error: "Неверная роль"
            });
        } else if(newRole === 3) {
            return res.status(400).json({
                error: "Нельзя повышать до создателя" 
            });
        } else if(user.role >= req.user.role || newRole > req.user.role) {
            return res.status(403).json({
                error: "Нельзя повышать роль выше своей или чужой",
            });
        } 

        user.role = newRole;
        await user.save();

        res.json({ message: "Роль обновлена", role: user.role });
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


app.post("/upload/:userId", uploads.single("filedata") , async (req, res) => {
  try {
    const filedata = req.file;
    if (!filedata) return res.status(400).send("Файл не загружен");

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send("Пользователь не найден");

    if (user.avatar && !user.avatar.startsWith("http")) {
      const oldPath = path.join(__dirname, user.avatar);
      fs.unlink(oldPath, (err) => {
        if (err) console.log("❌ Не удалось удалить старую аватарку:", err.message);
      });
    }

    const newAvatarPath = "/uploads/" + filedata.filename;

    user.avatar = newAvatarPath;
    await user.save();

    res.json({
      message: "Аватар обновлён!",
      avatar: newAvatarPath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/users/:id", verifyToken, async (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ error: "Нельзя редактировать чужой профиль" });
    }

    const user = await User.findById(req.params.id);
    if(!user) {
        return res.status(404).json({
            error: "Пользователь не найден",
        });
    }
    const newUserData = await req.body;
    if(newUserData.name !== user.name){
        user.name = newUserData.name;
    }
    if(newUserData.bio !== user.bio){
        user.bio = newUserData.bio;
    }
    await user.save();
    res.json(user);
})

app.delete("/api/users/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                error: "Пользователь не найден",
            })
        }

        await Post.deleteMany({
            author: user._id,
        })

        await User.findByIdAndDelete(user._id)

        await User.updateMany({
            followings: user._id
        }, {
            $pull: {
                followings: user._id
            }
        })

        await User.updateMany(
            { followers: user._id },
            { $pull: { followers: user._id }}
        )

        if(user.avatar && !user.avatar.startsWith("http")) {
            fs.unlink(path.join(__dirname, user.avatar), err => {
                if (err) console.log("Ошибка удаления:", err.message);
            });
        }

        res.json({
            message: "Пользователь удалён!"
        })
        
    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }
})

app.post("/api/users/:id/follow", verifyToken, async (req, res) => {
    try {
        const targetId = req.params.id;

        const userId  = req.user.id;

        if(userId === targetId) {
            return res.status(400).json({
                error: "Нельзя подписаться на самого себя",
            })
        }

        const user = await User.findById(userId);
        const target = await User.findById(targetId);

        if(!user || !target) {
            return res.status(404).json({
                error: "Пользователь не найден",
            })
        }

        if (user.followings.includes(targetId)) {
            return res.status(400).json({
                error: "Уже подписан",
            })
        }

        user.followings.push(targetId);
        target.followers.push(userId);

        await user.save();
        await target.save();

        res.json({ message: "Вы подписались!" });
    } catch (err) {
        res.status(500).json({
            error: "Ошибка сервера"
        })
    }
})

app.post("/api/users/:id/unfollow", verifyToken, async (req, res) => {
    try {
        const targetId = req.params.id;

        const userId  = req.user.id;

        if(userId === targetId) {
            return res.status(400).json({
                error: "Нельзя подписаться на самого себя",
            })
        }

        const user = await User.findById(userId);
        const target = await User.findById(targetId);

        if(!user || !target) {
            return res.status(404).json({
                error: "Пользователь не найден",
            })
        }

        if (!user.followings.includes(targetId)) {
            return res.status(400).json({
                error: "Не подписан",
            })
        }

        user.followings.pull(targetId);
        target.followers.pull(userId);

        await user.save();
        await target.save();

        res.json({ message: "Вы отписались!" });
    } catch (err) {
        res.status(500).json({
            error: "Ошибка сервера"
        })
    }
})

app.get("/api/users/:id/followers", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("followers", "name avatar _id");
        if (!user) {
            return res.status(404).json({
                error: "Пользователь не найден",
            })
        }

        res.json(user.followers);
    } catch (err) {
        res.status(500).json({
            error: "Ошибка сервера"
        })
    }
})

app.get("/api/users/:id/followings", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("followings", "name avatar _id");
        if (!user) {
            return res.status(404).json({
                error: "Пользователь не найден",
            })
        }

        res.json(user.followings);
    } catch (err) {
        res.status(500).json({
            error: "Ошибка сервера"
        })
    }
})

app.post("/api/posts", verifyToken, async (req, res) => {
    try {
        const {title, text} = req.body;
        const authorId = req.user.id;
        if(!title || !text || !authorId) {
            return res.status(400).json({
                error: "Не все данные переданы",
            })
        }
        const author = await User.findById(authorId);
        if(!author) {
            return res.status(404).json({
                error: "Пользователь не найден",
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

        res.json(post); 
    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }
})

app.get("/api/posts/", async (req, res) => {
    try {
        const posts = await Post.find({}).populate("author", "name avatar _id");
        if (posts.length === 0) {
            return res.status(404).json({ error: "Посты не найдены" });
        }


        res.json(posts)
    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }
})

app.get("/api/posts/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "name avatar _id");
        if(!post) {
            return res.status(404).json({
                error: "Пост не найден",
            })
        }

        res.json(post)
    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }
})

app.delete("/api/posts/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Пост не найден" });

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ error: "Не твой пост" });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({ success: true });
    } catch {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.get("/api/posts/likes", async (req, res) => {
    try{
        const { userId } = req.query;
        if(!userId) {
            return res.status(400).json({
                error: "Не передан id пользователя",
            })
        }
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({
                error: "Пользователь не найден",
            })
        }

        const posts = await Post.find({
            _id: {
                $in: user.likes,
            }
        }).populate("author", "name avatar _id");

        res.json(posts)
    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }
})

app.get("/api/posts/followings", async (req, res) => {
    try {
        const userId = req.body.userId;
        if(!userId) {
            return res.status(400).json({
                error: "Не передан id пользователя",
            })
        }

        const user = await User.findById(userId);

        const posts = await Post.find({
            author: {
                $in: user.followings,
            }
        }).populate("author", "name avatar _id");

        res.json(posts)
    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }
})


app.post("/api/posts/:id/like", verifyToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const userId = req.user.id;

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                error: "Пользователь не найден",
            })
        }
        if(user.likes.includes(postId)) {
            res.status(400).json({
                error: "Вы уже лайкали этот пост",
            })
        }
        
        post.likes = post.likes + 1;
        user.likes.push(postId);

        await user.save();
        await post.save();



        res.json({
            message: "Пост лайкнут",
        })
    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }
})

app.post("/api/posts/:id/unlike", verifyToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const userId = req.user.id;

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                error: "Пользователь не найден",
            })
        }
        if(!user.likes.includes(postId)) {
            res.status(400).json({
                error: "Вы ещё не лайкали этот пост",
            })
        }
        
        post.likes = Math.max(0, post.likes - 1);
        user.likes = user.likes.filter(id => id.toString() !== postId);

        await user.save();
        await post.save();

        res.json({
            message: "Лайк убран",
        })
    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }
})

app.get("/api/search", async (req, res) => {
    try {
        const { q } = req.query;
        if(!q) {
            return res.status(400).json({
                error: "Не передан поисковый запрос",
            })
        }

        const users = await User.find({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { bio: { $regex: q, $options: "i" } },
            ]
        }).select("_id name avatar posts").lean();

        const formatedUsers = users.map((user) => ({
            type: "user",
            _id: user._id,
            name: user.name,
            bio: user.bio,
            avatar: user.avatar,
            posts: user.posts ? user.posts.length : 0,
        }));


        const posts = await Post.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { text: { $regex: q, $options: "i" } },
            ],
        })
        .populate("author", "name avatar _id")
        .select("title text author createdAt _id")
        .lean()

        const formatedPosts = posts.map((post) => ({
            type: "post",
            _id: post._id,
            likes: post.likes,
            title: post.title,
            text: post.text,
            createdAt: post.createdAt,
            author: post.author,
        }))

        const results = [...formatedUsers , ...formatedPosts]

        results.sort((a, b) => {
            if (a.type === "post" && b.type === "user") return -1;
            if (a.type === "user" && b.type === "post") return 1;
            if (a.type === "post") return b.likes - a.likes;
            if (a.type === "user") return (b.posts || 0) - (a.posts || 0);
            return 0;
        });


        res.json(results)
    } catch(err) {
        res.status(500).json({
            error: "Ошибка сервера",
        });
    }
})

app.listen(3000);