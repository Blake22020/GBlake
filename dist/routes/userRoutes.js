"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    dest: "uploads/",
});
router.get("/:id", async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).send("User Not Found");
        }
        res.json(formatUser(user));
    }
    catch {
        res.status(500).send("Server Error");
    }
});
router.patch("/me", auth_1.auth, async (req, res) => {
    try {
        const { visualName, bio, username } = req.body;
        const user = await User_1.default.findById(req.user.id);
        if (!user)
            return res.status(404).send("User Not Found");
        if (username && username !== user.username) {
            const exist = await User_1.default.findOne({ username });
            if (exist) {
                res.status(409).send("Username already used");
            }
        }
        if (visualName)
            user.visualName = visualName;
        if (bio)
            user.bio = bio;
        await user.save();
        res.json(formatUser(user));
    }
    catch {
        res.status(500).json({ message: "Server Error" });
    }
});
router.post("/:id/follow", auth_1.auth, async (req, res) => {
    try {
        const meId = req.user.id;
        const targetId = req.params.id;
        if (meId === targetId) {
            return res.status(404).send("Cannot follow yourself");
        }
        const me = await User_1.default.findById(meId);
        if (!me)
            return res.status(404).send("Ваш аккаунт не найден");
        const target = await User_1.default.findById(targetId);
        if (!target)
            return res.status(404).send("User Not Found");
        const already = me.followings.some(id => id.toString() === targetId);
        if (!already) {
            me.followings = me.followings.filter(id => id.toString() !== targetId);
            target.followers = target.followers.filter(id => id.toString() !== meId);
            await me.save();
            await target.save();
            return res.json({
                following: false,
            });
        }
        else {
            me.followings.push(targetId);
            target.followers.push(meId);
            await me.save();
            await target.save();
            return res.json({
                following: true,
            });
        }
    }
    catch {
        res.status(500).json({ message: "Server Error" });
    }
});
router.get("/:id/followers", async (req, res) => {
    const user = await User_1.default.findById(req.params.id).populate("followers", "username visualName avatar");
    if (!user)
        return res.status(404).send("User Not Found");
    res.json(user.followers);
});
router.get("/:id/followings", async (req, res) => {
    const user = await User_1.default.findById(req.params.id).populate("followings", "username visualName avatar");
    if (!user)
        return res.status(404).send("User Not Found");
    res.json(user.followings);
});
router.post("/me/avatar", auth_1.auth, upload.single("file"), async (req, res) => {
    try {
        const fileData = req.file;
        if (!fileData)
            return res.status(400).send("Файл не загружен");
        const user = await User_1.default.findById(req.user?.id);
        if (!user)
            return res.status(404).send("Пользователь не найден");
        if (user.avatar && !user.avatar.startsWith("http")) {
            const oldPath = path_1.default.join(__dirname, user.avatar);
            fs_1.default.unlink(oldPath, (err) => {
                if (err)
                    console.log("❌ Не удалось удалить старую аватарку:", err.message);
            });
        }
        const newAvatarPath = "/uploads/" + fileData.filename;
        user.avatar = newAvatarPath;
        await user.save();
        res.json({
            message: "Аватар обновлён!",
            avatar: newAvatarPath,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});
function formatUser(u) {
    return {
        id: u._id,
        username: u.username,
        visualName: u.visualName,
        bio: u.bio,
        followers: u.followers.length,
        followings: u.followings.length
    };
}
exports.default = router;
