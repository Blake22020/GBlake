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