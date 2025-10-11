const express = require('express');
const mongoose = require('mongoose');
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
    followers: {
        type: Number,
        default: 0
    },
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

app.post("/users", async (req, res) => {
    try {
        const {email, password} = req.body;
        const excistingUser = await User.findOne({email});

        if (excistingUser) {
            return res.status(400).json({
                error: "Пользователь с таким email уже существует.",
            })
        }

        const newUser = new User({email, password});

        await newUser.save();

        res.status(201).json({
            message: "Пользователь создан!",
            user: newUser,
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({
            error: "Ошибка сервера",
        })
    }
})

app.get("/users/:id", async (req, res) => {
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

app.put("/users/:id", async (req, res) => {
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
    if(newUser.bio !== user.bio){
        user.bio = newUserData.bio;
    }
    await user.save();
    res.json(user);
})

app.listen(3000)