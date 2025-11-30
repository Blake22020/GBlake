import { Router, Request, Response } from "express";
import User from "../models/User";
import { auth } from "../middleware/auth";
import multer from "multer";

const router = Router();

const upload = multer({
    dest: "uploads/",
});


router.get("/api/users/:id", async (req :Request, res:Response) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).send("User Not Found");
        }

        res.json(formatUser(user));
    } catch {
        res.status(404).send("Server Error");
    }
})

router.patch("/api/user/me", auth, async (req :Request, res :Response) => {
    try {
        const { visualName, bio, username } = req.body;

        const user = await User.findById(req.user!.id);
        if(!user) return res.status(404).send("User Not Found");

        if(username && username !== user.username)  {
            const exist = await User.findOne({ username })
            if (exist) {
                res.status(409).send("Username already used");
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