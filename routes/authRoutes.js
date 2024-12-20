import User from '../models/User.js'
import express from 'express'

const router = express.Router()

// Signup the user
router.post('/signup', async (req, res) => {
    const { email, confirmPassword, password, name } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Name, Email and Password are required"
        })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ status: 'error', message: 'Invalid email format' });
    }

    if (password.length < 8) {
        return res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters long' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ status: 'error', message: 'Passwords not matchs' });
    }

    try {
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({
                status: "error",
                message: "User already exists"
            })
        }
        const newUser = new User({ name, email, password })
        await newUser.save()
        res.status(201).json({
            status: "succeed",
            message: "You account has been created successfully"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: "error",
            message: "Server error"
        })
    }

})

// Login the user
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Email and Password are required"
        })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials"
            })
        }
        const passwordMatch = user.comparePassword(user.password, password)
        if (!passwordMatch) {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials"
            })
        }

        const token = user.generateToken()

        res.status(200).json({
            status: "success",
            data: {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: token
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: "error",
            message: "Server error"
        })
    }
})

export default router