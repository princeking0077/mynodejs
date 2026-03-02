const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * Get all content (for sitemap/RSS)
 * GET /api/content/all
 */
router.get('/all', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, subject_id, title, slug, description, meta_description, primary_keyword, created_at, updated_at FROM content ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('[Public] Error fetching all content:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch content' });
    }
});

/**
 * Get recent content
 * GET /api/content/recent?limit=50
 */
router.get('/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const [rows] = await pool.query(
            `SELECT id, subject_id, title, slug, description, meta_description, primary_keyword,
                    blog_content, created_at, updated_at
             FROM content
             ORDER BY created_at DESC
             LIMIT ?`,
            [limit]
        );
        res.json(rows);
    } catch (error) {
        console.error('[Public] Error fetching recent content:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch recent content' });
    }
});

/**
 * Get content statistics
 * GET /api/content/stats
 */
router.get('/stats', async (req, res) => {
    try {
        const [totalCount] = await pool.query('SELECT COUNT(*) as count FROM content');
        const [bpharmCount] = await pool.query("SELECT COUNT(*) as count FROM content WHERE subject_id LIKE 'bp%'");
        const [gpatCount] = await pool.query("SELECT COUNT(*) as count FROM content WHERE subject_id NOT LIKE 'bp%'");
        const [recentCount] = await pool.query(
            "SELECT COUNT(*) as count FROM content WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
        );

        res.json({
            total: totalCount[0].count,
            bpharm: bpharmCount[0].count,
            gpat: gpatCount[0].count,
            thisWeek: recentCount[0].count
        });
    } catch (error) {
        console.error('[Public] Error fetching stats:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
    }
});

module.exports = router;
