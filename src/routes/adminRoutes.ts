import { Request, Response, Router } from "express";
import { auth, isAdmin } from "../middleware/auth";
import User from "../models/User";
import Post from "../models/Post"
import path from "path"
import fs from "fs"

const router = Router();

router.post("/promote/:id", auth, isAdmin, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const targetUser = await User.findById(req.user!.id);
        if (!targetUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const newRole = parseInt(req.body.role);

        if(![-1, 0, 1, 2, 3].includes(newRole)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        if(targetUser.role >= req.user!.role || (newRole !== -1 && newRole > req.user!.role)) {
            return res.status(403).json({
                error: "Нельзя повышать роль выше своей или чужой"
            })
        }

        if(newRole === -1) {
            await Post.deleteMany({ author: targetUser._id })

            await User.updateMany(
                { followings: targetUser._id },
                { $pull: { followers: targetUser._id }}
            )

            if(targetUser.avatar && !targetUser.avatar.startsWith("http")) {
                const avatarPath = path.join(__dirname, targetUser.avatar);
                fs.unlink(avatarPath, (err) => {
                    if(err) console.log("Ошибка удаления аватара: ", err.message);
                })
            }

            await User.findByIdAndDelete(targetUser._id);

            return res.json({ message: "Пользователь забанен и удалён"})
        }

        if(![0, 1, 2, 3].includes(newRole)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        if (newRole === 3) {
            return res.status(400).json({ error: "Нельзя повышать до создателя" })
        }

        targetUser.role = newRole;
        await targetUser.save();

        res.json({ message: "Роль обновлена ", role: targetUser.role });
    } catch (err) {
        res.status(500).json({error: "Ошибка сервера" })
    }
})

export default router;