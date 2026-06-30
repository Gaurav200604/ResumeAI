const userModel = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BlacklistToken = require('../model/blacklist.model');

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};

async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserAlreadyExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({ username, email, password: hash });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, COOKIE_OPTIONS);

        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error("[Auth - register]", err);
        res.status(500).json({ message: "Registration failed. Please try again." });
    }
}

async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, COOKIE_OPTIONS);

        res.status(200).json({
            message: "Login successful",
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error("[Auth - login]", err);
        res.status(500).json({ message: "Login failed. Please try again." });
    }
}

async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token;
        if (token) {
            await BlacklistToken.create({ token });
        }
        res.clearCookie("token", COOKIE_OPTIONS);
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.error("[Auth - logout]", err);
        res.status(500).json({ message: "Logout failed." });
    }
}

async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User fetched successfully",
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error("[Auth - getMe]", err);
        res.status(500).json({ message: "Failed to fetch user." });
    }
}

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController };
