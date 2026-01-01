import { Router, Request, Response } from "express";
import User from "../models/User";
import { auth } from "../middleware/auth";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const upload = multer({
    dest: "uploads/",
});


router.get("/:id", async (req :Request, res:Response) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("posts", "_id title text createdAt likes liked author");
            
        if (!user) {
            return res.status(404).send("User Not Found");
        }

        res.json({
            id: user._id,
            username: user.username,
            visualName: user.visualName,
            bio: user.bio,
            followers: user.followers.length,
            followings: user.followings.length,
            avatar: user.avatar,
            posts: user.posts
        });
    } catch {
        res.status(500).send("Server Error");
    }
})


router.patch("/me", auth, async (req :Request, res :Response) => {
    try {
        const { visualName, bio, username } = req.body;

        const user = await User.findById(req.user!.id);
        if(!user) return res.status(404).send("User Not Found");

        if(username && username !== user.username)  {
            const exist = await User.findOne({ username })
            if (exist) {
                return res.status(409).send("Username already used");
            }
        }

        if (visualName) user.visualName = visualName;
        if(bio) user.bio = bio;

        await user.save();

        res.json(formatUser(user));
    } catch {
        res.status(500).json({ message: "Server Error" });
    }
})

router.get("/:id/follow", auth, async (req :Request, res :Response) => {
    try {
        const meId = req.user!.id;
        const targetId = req.params.id;

        if(meId === targetId) {
            return res.json({ following: false });
        }

        const me = await User.findById(meId);
        if (!me) return res.status(404).json({ message: "Ваш аккаунт не найден" });

        const isFollowing = me.followings.some(id => id.toString() === targetId);
        
        res.json({ following: isFollowing });
    } catch {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.post("/:id/follow", auth, async (req :Request, res :Response) => {
    try {
        const meId = req.user!.id;
        const targetId = req.params.id;

        if(meId  === targetId) {
            return res.status(404).json({ message: "Cannot follow yourself" });
        }

        const me = await User.findById(meId);
        if (!me) return res.status(404).json({ message: "Ваш аккаунт не найден" });

        const target = await User.findById(targetId);
        if(!target) return res.status(404).json({ message: "Пользоватеь не найден" });

        const already = me!.followings.some(id => id.toString() === targetId);
        if(already) {
            me!.followings = me!.followings.filter( id => id.toString() !== targetId);
            target.followers = target.followers.filter(id => id.toString() !== meId);

            await me!.save();
            await target.save();

            return res.json({
                following: false,
            })
        } else {
            me!.followings.push(targetId as any);
            target.followers.push(meId as any);

            await me!.save();
            await target.save();

            return res.json({
                following: true,
            })
        }
    } catch {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.get("/:id/followers", async (req :Request, res :Response) => {
    const user = await User.findById(req.params.id).populate("followers", "username visualName avatar")
    if(!user) return res.status(404).send("User Not Found");
    res.json(user.followers)
})

router.get("/:id/followings", async (req :Request, res :Response) => {
    const user = await User.findById(req.params.id).populate("followings", "username visualName avatar")
    if(!user) return res.status(404).send("User Not Found");
    res.json(user.followings)
})

router.post("/me/avatar", auth, upload.single("file"), async (req :Request, res :Response) => {
    try {
        const fileData = req.file;
        if (!fileData) return res.status(400).send("Файл не загружен");

        const user = await User.findById(req.user?.id);
        if (!user) return res.status(404).send("Пользователь не найден");

        if (user.avatar && !user.avatar.startsWith("http")) {
            const oldPath = path.join(__dirname, user.avatar);
            fs.unlink(oldPath, (err) => {
                if (err) console.log("❌ Не удалось удалить старую аватарку:", err.message);
            });
        }

        const newAvatarPath = "/uploads/" + fileData.filename;

        user.avatar = newAvatarPath;
        await user.save();

        res.json({
            message: "Аватар обновлён!",
            avatar: newAvatarPath,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
})



function formatUser(u: any) {
    return {
        id: u._id,
        username: u.username,
        visualName: u.visualName,
        bio: u.bio,
        followers: u.followers.length,
        followings: u.followings.length
    }
}

export default router;