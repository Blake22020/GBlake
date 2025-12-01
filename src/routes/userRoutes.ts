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

router.post("/api/users/:id/follow", auth, async (req :Request, res :Response) => {
    try {
        const meId = req.user!.id;
        const targetId = req.params.id;

        if(meId  === targetId) {
            return res.status(404).send("Cannot follow yourself");
        }

        const me = await User.findById(meId);

        const target = await User.findById(targetId);
        if(!target) return res.status(404).send("User Not Found");

        const already = me!.followings.includes(targetId as any);
        if(!already) {
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
                followings: false,
            })
        }
    } catch {
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/api/users/:id/followers", async (req :Request, res :Response) => {
    const user = await User.findById(req.params.id).populate("followers", "username visualName avatar")
    if(!user) return res.status(404).send("User Not Found");
    res.json(user.followers)
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