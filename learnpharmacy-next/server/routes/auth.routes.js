const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 10, // 10 attempts
    message: { message: 'Too many attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Login Route
router.post('/login', authLimiter, async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate Token
        // FALLBACK SECRET applied because server env is unreliable
        const secret = process.env.JWT_SECRET || 'fallback_secret_key_123456';
        const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '24h' });

        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24h
        });

        res.json({
            message: "Login successful",
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({
            message: "Server error: " + error.message,
            stack: error.stack,
            env_check: {
                has_jwt: !!process.env.JWT_SECRET,
                db_host: process.env.DB_HOST
            }
        });
    }
});

const authenticateToken = require('../middleware/auth.middleware');

// Verify Token
router.get('/verify', authenticateToken, (req, res) => {
    res.json({ message: "Token is valid", user: req.user });
});

// Change Password Route
router.post('/change-password', authenticateToken, authLimiter, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: "Missing fields" });

    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
        if (rows.length === 0) return res.status(404).json({ message: "User not found" });

        const user = rows[0];
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return res.status(401).json({ message: "Incorrect current password" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, req.user.id]);

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("PASSWORD UPDATE ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    res.clearCookie('adminToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ message: "Logout successful" });
});

module.exports = router;
