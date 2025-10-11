const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const app = express();
 
app.use(express.static("public"));
app.use(express.json());

app.use(express.static(__dirname));
app.use(multer({dest:"uploads"}).single("filedata"));


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
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

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

        const newUser = new User({email, password: hashedPassword});

        await newUser.save();

        res.status(201).json({
            message: "Пользователь создан!",
            user: {
                _id: newUser._id,
                name: newUser.name,
                avatar: newUser.avatar,
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
            res.status(404).json({
                error: "Пользователь не найден",
            })
        }

        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) {
            return res.status(401).json({
                error: "Неверный пароль",
            })
        }

        res.json({
            message: "Пользователь авторизован!",
            user: {
                _id: user._id,
                name: user.name,
                avatar: user.bio,
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

app.post("/upload/:userId", async (req, res) => {
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

app.put("/api/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) {
        res.status(404).json({
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

app.delete("/api/users/:id", async (req, res) => {
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
            fs.unlink(path.join(__dirname, user.avatar))
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

app.get("/api/users/:id/follow", async (req, res) => {
    try {
        const targetId = req.params.id;

        const { userId } = req.body;

        if(userId === targetId) {
            res.status(400).json({
                error: "Нельзя подписаться на самого себя",
            })
        }

        const user = await User.findById(userId);
        const target = await User.findById(targetId);

        if(!user || !target) {
            res.status(404).json({
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

app.get("/api/users/:id/unfollow", async (req, res) => {
    try {
        const targetId = req.params.id;

        const { userId } = req.body;

        if(userId === targetId) {
            res.status(400).json({
                error: "Нельзя подписаться на самого себя",
            })
        }

        const user = await User.findById(userId);
        const target = await User.findById(targetId);

        if(!user || !target) {
            res.status(404).json({
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
        const user = await User.findById(req.params.id).populate("followers", "name avatar");
        if (!users) {
            res.status(404).json({
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
        const user = await User.findById(req.params.id).populate("followings", "name avatar");
        if (!user) {
            res.status(404).json({
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

app.listen(3000)