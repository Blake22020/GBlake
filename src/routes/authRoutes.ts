import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator'
import User from '../models/User'
import { env } from '../config/env'

const router = Router();

router.post('/register1',
    [
        body('email').isEmail(),
        body('password').isLength({ min: 6 }),
        body('username').optional().isLength({ min: 1 , max: 20 }),
    ],
    async (req :Request, res :Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, username } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).json( { message: 'Email already exist' } );
        }

        const existingUsername = await User.findOne( {username} );
        if(existingUsername) {
            return res.status(409).json( { message: 'Username already exist' } );
        }

        const hashed = await bcrypt.hash(password, 10);
        const role = email === env.creator ? 3 : 0;

        const user = await User.create({
            email,
            password: hashed,
            username,
            role,
        })

        const token = jwt.sign(
            { id: user._id, role: user.role },
            env.jwtSecret,
            { expiresIn: "365d" }
        )

        res.json( {user, token } )
    }
)

router.patch("/register2", async (req: Request, res: Response) => {
    try {
        const { visualName, bio } = req.body;
        
        const user = await User.findById(req.user!.id);
        if(!user) {
            return res.status(404).send("User Not Found")
        }

        if(visualName) user.visualName = visualName;
        if(bio) user.bio = bio;

        await user.save();

        res.json(formatUser(user));
    } catch {
        res.status(500).json({ message: "Server Error"})
    }
})

router.post('/login',
    [
        body('password').notEmpty().withMessage('Password is required'),
        body('email').optional().isEmail().withMessage('Invalid email'),
        body('username').optional().isString().trim().isLength({ min: 1 }).withMessage('Invalid username')
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Invalid credentials', errors: errors.array() });
        }

        const { email, username, password } = req.body;

        if ((!email && !username) || (email && username)) {
            return res.status(400).json({
                message: 'Please provide either email or username, but not both.'
            });
        }

        const user = await User.findOne(email ? { email } : { username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            env.jwtSecret,
            { expiresIn: '365d' }
        );

        res.json({ user, token });
    }
);

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
