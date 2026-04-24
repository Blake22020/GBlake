"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const env_1 = require("../config/env");
const auth_1 = require("../middleware/auth");
const handleError_1 = require("../utils/handleError");
const router = (0, express_1.Router)();
router.post("/register1", [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("password").isLength({ min: 8 }),
    (0, express_validator_1.body)("username").isLength({ min: 1, max: 20 }),
], async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((err) => err.msg)
            .join(", ");
        return next(new handleError_1.AppError(400, errorMessages));
    }
    try {
        const { email, password, username } = req.body;
        const existingEmail = await User_1.default.findOne({ email });
        if (existingEmail) {
            return next(new handleError_1.AppError(409, "Email already exist"));
        }
        const existingUsername = await User_1.default.findOne({ username });
        if (existingUsername) {
            return next(new handleError_1.AppError(409, "Username already exist"));
        }
        const hashed = await bcrypt_1.default.hash(password, 10);
        const role = email === env_1.env.creator ? 3 : 0;
        const user = await User_1.default.create({
            email,
            password: hashed,
            username,
            role,
        });
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, env_1.env.jwtSecret, { expiresIn: "365d" });
        res.json({ user: formatUser(user), token });
    }
    catch (err) {
        next(err);
    }
});
router.patch("/register2", auth_1.auth, async (req, res, next) => {
    try {
        const { visualName, bio } = req.body;
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            return next(new handleError_1.AppError(404, "Пользователь не найден"));
        }
        if (visualName)
            user.visualName = visualName;
        if (bio)
            user.bio = bio;
        await user.save();
        res.json(formatUser(user));
    }
    catch (err) {
        next(err);
    }
});
router.post("/login", [
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
    (0, express_validator_1.body)("email").optional().isEmail().withMessage("Invalid email"),
    (0, express_validator_1.body)("username")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1 })
        .withMessage("Invalid username"),
], async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new handleError_1.AppError(400, "Invalid credentials"));
    }
    try {
        const { email, username, password } = req.body;
        if ((!email && !username) || (email && username)) {
            return next(new handleError_1.AppError(400, "Please provide either email or username, but not both."));
        }
        const user = await User_1.default.findOne(email ? { email } : { username });
        if (!user) {
            return next(new handleError_1.AppError(404, "Пользователь не найден"));
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return next(new handleError_1.AppError(400, "Invalid credentials"));
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, env_1.env.jwtSecret, { expiresIn: "365d" });
        res.json({ user: formatUser(user), token });
    }
    catch (err) {
        next(err);
    }
});
function formatUser(u) {
    return {
        id: u._id.toString(),
        username: u.username,
        visualName: u.visualName,
        bio: u.bio,
        followers: u.followers ? u.followers.length : 0,
        followings: u.followings ? u.followings.length : 0,
    };
}
exports.default = router;
