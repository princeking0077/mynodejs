const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth.middleware');

let globalCache = null;
let globalCacheTime = 0;
const CACHE_LIFETIME = 1000 * 60 * 60; // 1 hour

// GET all settings (Public - for Layout injection)
router.get('/public', async (req, res) => {
    try {
        if (globalCache && (Date.now() - globalCacheTime < CACHE_LIFETIME)) {
            return res.json(globalCache);
        }

        const [rows] = await pool.query("SELECT setting_key, setting_value FROM global_seo_settings");
        const settings = {};
        rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });

        globalCache = settings;
        globalCacheTime = Date.now();
        res.json(settings);
    } catch (error) {
        console.error(error);
        res.json(globalCache || {}); // Fail gracefully for public, fallback to cache if exists
    }
});

// GET all settings (Admin - for editing)
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Fetch global settings
        const [rows] = await pool.query("SELECT setting_key, setting_value, description FROM global_seo_settings");
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
    const settings = req.body; // Expect key-value object

    try {
        const keys = Object.keys(settings);
        for (const key of keys) {
            const value = settings[key];
            await pool.query(
                "INSERT INTO global_seo_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
                [key, value, value]
            );
        }
        globalCache = null; // Invalidate cache aggressively to force reload on next hit
        res.json({ message: "Global settings updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update settings" });
    }
});

// TEMPORARY FIX ROUTE
router.get('/upgrade-fix', async (req, res) => {
    try {
        await pool.query("ALTER TABLE content MODIFY COLUMN blog_content LONGTEXT");
        res.json({ message: "SUCCESS: blog_content upgraded to LONGTEXT" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
