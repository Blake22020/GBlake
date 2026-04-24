import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User";
import { env } from "../config/env";
import { auth } from "../middleware/auth";
import { AppError } from "../utils/handleError";

const router = Router();

router.post(
    "/register1",
    [
        body("email").isEmail(),
        body("password").isLength({ min: 8 }),
        body("username").isLength({ min: 1, max: 20 }),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors
                .array()
                .map((err) => err.msg)
                .join(", ");
            return next(new AppError(400, errorMessages));
        }

        try {
            const { email, password, username } = req.body;

            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return next(new AppError(409, "Email already exist"));
            }

            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return next(new AppError(409, "Username already exist"));
            }

            const hashed = await bcrypt.hash(password, 10);
            const role = email === env.creator ? 3 : 0;

            const user = await User.create({
                email,
                password: hashed,
                username,
                role,
            });

            const token = jwt.sign(
                { id: user._id, role: user.role },
                env.jwtSecret,
                { expiresIn: "365d" },
            );

            res.json({ user: formatUser(user), token });
        } catch (err) {
            next(err);
        }
    },
);

router.patch("/register2", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { visualName, bio } = req.body;

        const user = await User.findById(req.user!.id);
        if (!user) {
            return next(new AppError(404, "Пользователь не найден"));
        }

        if (visualName) user.visualName = visualName;
        if (bio) user.bio = bio;

        await user.save();

        res.json(formatUser(user));
    } catch (err) {
        next(err);
    }
});

router.post(
    "/login",
    [
        body("password").notEmpty().withMessage("Password is required"),
        body("email").optional().isEmail().withMessage("Invalid email"),
        body("username")
            .optional()
            .isString()
            .trim()
            .isLength({ min: 1 })
            .withMessage("Invalid username"),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new AppError(400, "Invalid credentials"));
        }

        try {
            const { email, username, password } = req.body;

            if ((!email && !username) || (email && username)) {
                return next(new AppError(400, "Please provide either email or username, but not both."));
            }

            const user = await User.findOne(email ? { email } : { username });
            if (!user) {
                return next(new AppError(404, "Пользователь не найден"));
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return next(new AppError(400, "Invalid credentials"));
            }

            const token = jwt.sign(
                { id: user._id, role: user.role },
                env.jwtSecret,
                { expiresIn: "365d" },
            );

            res.json({ user: formatUser(user), token });
        } catch (err) {
            next(err);
        }
    },
);

function formatUser(u: any) {
    return {
        id: u._id.toString(),
        username: u.username,
        visualName: u.visualName,
        bio: u.bio,
        followers: u.followers ? u.followers.length : 0,
        followings: u.followings ? u.followings.length : 0,
    };
}

export default router;
