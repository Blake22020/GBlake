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
const router = (0, express_1.Router)();
router.post('/register1', [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('username').optional().isLength({ min: 1, max: 20 }),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, username } = req.body;
    const existingEmail = await User_1.default.findOne({ email });
    if (existingEmail) {
        return res.status(409).json({ message: 'Email already exist' });
    }
    const existingUsername = await User_1.default.findOne({ username });
    if (existingUsername) {
        return res.status(409).json({ message: 'Username already exist' });
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
    res.json({ user, token });
});
router.patch("/register2", async (req, res) => {
    try {
        const { visualName, bio } = req.body;
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).send("User Not Found");
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
router.post('/login', [
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Invalid email'),
    (0, express_validator_1.body)('username').optional().isString().trim().isLength({ min: 1 }).withMessage('Invalid username')
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Invalid credentials', errors: errors.array() });
    }
    const { email, username, password } = req.body;
    if ((!email && !username) || (email && username)) {
        return res.status(400).json({
            message: 'Please provide either email or username, but not both.'
        });
    }
    const user = await User_1.default.findOne(email ? { email } : { username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, env_1.env.jwtSecret, { expiresIn: '365d' });
    res.json({ user, token });
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
