import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator'
import User from '../models/User'
import { env } from '../config/env'

const router = Router();

router.post('/register',
    [
        body('email').isEmail(),
        body('password').isLength({ min: 6 }),
        body('username').optional().isLength({ min: 1 , max: 20 }),
        body('visualName').optional().isLength({ min: 1 , max: 20 })
    ],
    async (req :Request, res :Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, username, visualName } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).json( { message: 'Email already exist' } );
        }

        const existingUsername = await User.findOne( {username} );
        if(existingUsername) {
            return res.status(409).json( { message: 'Username already exist' } );
        }

        const hashed = await bcrypt.hash(password, 10);
        const role = existingEmail === env.creator ? 3 : 0;

        const user = await User.create({
            email,
            password: hashed,
            username,
            visualName,
            role,
        })

        const token = jwt.sign(
            { id: user._id, role: user.role },
            env.jwtSecret,
            { expiresIn: "365d" }
        )

        res.json( { user, token } )
    }
)

router.post('/login',
    [
        body('email').isEmail(),
        body('password').exists()
    ],
    async (req :Request, res :Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const { email, password } = req.body;

        const user  = await User.findOne({ email })
        if(!user) {
            return res.status(404).json( { message: 'User not found' } );
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ errors: errors.array() });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            env.jwtSecret,
            { expiresIn: "365d" }
        )
        res.json( { user , token } )
    }
)

export default router;
