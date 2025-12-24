const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth.middleware');

// GET all settings (Public - for Layout injection)
router.get('/public', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT setting_key, setting_value FROM settings");
        const settings = {};
        rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch settings" });
    }
});

// GET all settings (Admin - for editing)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT setting_key, setting_value FROM settings");
        const settings = {};
        rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch settings" });
    }
});

// POST/PUT update settings (Admin only)
router.post('/', authenticateToken, async (req, res) => {
    const settings = req.body; // Expect object like { "google_analytics": "UA-XXX", ... }

    try {
        const keys = Object.keys(settings);
        for (const key of keys) {
            const value = settings[key];
            await pool.query(
                "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
                [key, value, value]
            );
        }
        res.json({ message: "Settings updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update settings" });
    }
});

module.exports = router;
