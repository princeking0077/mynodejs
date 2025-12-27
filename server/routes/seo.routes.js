const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth.middleware');
const SitemapGenerator = require('../services/sitemap-generator');
const URLMapper = require('../services/url-mapper');
const InternalLinkingEngine = require('../services/internal-linking-engine');

/**
 * GET /api/seo/sitemap-index.xml
 * Returns sitemap index XML
 */
router.get('/sitemap-index.xml', async (req, res) => {
    try {
        const xml = await SitemapGenerator.getSitemap('index');
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Sitemap index error:', error);
        res.status(500).send('Error generating sitemap index');
    }
});

/**
 * GET /api/seo/sitemap-core.xml
 * Returns core pages sitemap
 */
router.get('/sitemap-core.xml', async (req, res) => {
    try {
        const xml = await SitemapGenerator.getSitemap('core');
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Core sitemap error:', error);
        res.status(500).send('Error generating core sitemap');
    }
});

/**
 * GET /api/seo/sitemap-content.xml
 * Returns content sitemap
 */
router.get('/sitemap-content.xml', async (req, res) => {
    try {
        const xml = await SitemapGenerator.getSitemap('content');
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Content sitemap error:', error);
        res.status(500).send('Error generating content sitemap');
    }
});

/**
 * GET /api/seo/robots.txt
 * Returns robots.txt
 */
router.get('/robots.txt', async (req, res) => {
    try {
        const robotsTxt = SitemapGenerator.generateRobotsTxt();
        res.header('Content-Type', 'text/plain');
        res.send(robotsTxt);
    } catch (error) {
        console.error('Robots.txt error:', error);
        res.status(500).send('Error generating robots.txt');
    }
});

/**
 * POST /api/seo/keyword-map
 * Create or update keyword mapping (Admin only)
 */
router.post('/keyword-map', authenticateToken, async (req, res) => {
    try {
        const { keyword, url, contentId, priority, searchVolume } = req.body;

        if (!keyword || !url) {
            return res.status(400).json({ error: 'Keyword and URL are required' });
        }

        await URLMapper.mapKeyword({
            keyword,
            url,
            contentId,
            priority: priority || 'medium',
            searchVolume: searchVolume || 0
        });

        res.json({ success: true, message: 'Keyword mapped successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/seo/keyword-mappings
 * Get all keyword mappings (Admin only)
 */
router.get('/keyword-mappings', authenticateToken, async (req, res) => {
    try {
        const mappings = await URLMapper.getAllMappings();
        res.json(mappings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/seo/cannibalization-check
 * Check for keyword cannibalization (Admin only)
 */
router.get('/cannibalization-check', authenticateToken, async (req, res) => {
    try {
        const duplicates = await URLMapper.detectCannibalization();
        res.json({
            cannibalizedKeywords: duplicates,
            count: duplicates.length,
            hasIssues: duplicates.length > 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/seo/internal-links/:contentId
 * Generate internal links for content
 */
router.get('/internal-links/:contentId', async (req, res) => {
    try {
        const { contentId } = req.params;
        const links = await InternalLinkingEngine.generateLinks(contentId);
        res.json(links);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/seo/orphan-pages
 * Find orphan pages (no incoming links) - Admin only
 */
router.get('/orphan-pages', authenticateToken, async (req, res) => {
    try {
        const orphans = await InternalLinkingEngine.detectOrphanPages();
        res.json({
            orphanPages: orphans,
            count: orphans.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/seo/regenerate-links
 * Regenerate all internal links (Admin only)
 */
router.post('/regenerate-links', authenticateToken, async (req, res) => {
    try {
        const results = await InternalLinkingEngine.regenerateAllLinks();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/seo/invalidate-sitemap
 * Invalidate sitemap cache (Admin only)
 */
router.post('/invalidate-sitemap', authenticateToken, async (req, res) => {
    try {
        const { type } = req.body;
        await SitemapGenerator.invalidateCache(type || 'all');
        res.json({ success: true, message: 'Sitemap cache invalidated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/seo/quality-report
 * Generate SEO quality report (Admin only)
 */
router.get('/quality-report', authenticateToken, async (req, res) => {
    try {
        // Check 1: Orphan pages
        const orphans = await InternalLinkingEngine.detectOrphanPages();

        // Check 2: Keyword cannibalization
        const cannibalization = await URLMapper.detectCannibalization();

        // Check 3: Pages without keywords
        const [withoutKeywords] = await pool.query(
            'SELECT id, title, canonical_url FROM content WHERE primary_keyword IS NULL OR primary_keyword = ""'
        );

        // Check 4: Pages with low word count
        const [lowWordCount] = await pool.query(
            'SELECT id, title, canonical_url, content_word_count FROM content WHERE content_word_count < 1200 AND content_word_count > 0'
        );

        // Check 5: Pages without canonical URL
        const [withoutCanonical] = await pool.query(
            'SELECT id, title FROM content WHERE canonical_url IS NULL OR canonical_url = ""'
        );

        // Check 6: Non-indexable pages count
        const [nonIndexable] = await pool.query(
            'SELECT COUNT(*) as count FROM content WHERE is_indexable = FALSE'
        );

        // Check 7: Total indexable pages
        const [indexable] = await pool.query(
            'SELECT COUNT(*) as count FROM content WHERE is_indexable = TRUE'
        );

        // Check 8: Sitemap stats
        const sitemapStats = await SitemapGenerator.getStatistics();

        const report = {
            timestamp: new Date().toISOString(),
            checks: {
                orphanPages: {
                    status: orphans.length === 0 ? 'pass' : 'fail',
                    count: orphans.length,
                    pages: orphans
                },
                keywordCannibalization: {
                    status: cannibalization.length === 0 ? 'pass' : 'fail',
                    count: cannibalization.length,
                    duplicates: cannibalization
                },
                missingKeywords: {
                    status: withoutKeywords.length === 0 ? 'pass' : 'warning',
                    count: withoutKeywords.length,
                    pages: withoutKeywords.slice(0, 10) // Limit to 10 for performance
                },
                lowWordCount: {
                    status: lowWordCount.length === 0 ? 'pass' : 'warning',
                    count: lowWordCount.length,
                    pages: lowWordCount.slice(0, 10)
                },
                missingCanonical: {
                    status: withoutCanonical.length === 0 ? 'pass' : 'fail',
                    count: withoutCanonical.length,
                    pages: withoutCanonical.slice(0, 10)
                },
                indexablePages: {
                    status: indexable[0].count > 0 ? 'pass' : 'fail',
                    count: indexable[0].count,
                    nonIndexableCount: nonIndexable[0].count
                },
                sitemapStatus: {
                    status: sitemapStats.length > 0 ? 'pass' : 'warning',
                    stats: sitemapStats
                }
            },
            overallScore: this.calculateOverallScore(orphans, cannibalization, withoutKeywords, lowWordCount, withoutCanonical, indexable[0].count)
        };

        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Calculate overall SEO quality score
 */
router.calculateOverallScore = (orphans, cannibalization, withoutKeywords, lowWordCount, withoutCanonical, indexableCount) => {
    let score = 100;

    // Deduct points for issues
    score -= orphans.length * 2; // -2 per orphan
    score -= cannibalization.length * 5; // -5 per cannibalized keyword
    score -= withoutKeywords.length * 1; // -1 per missing keyword
    score -= lowWordCount.length * 1; // -1 per low word count page
    score -= withoutCanonical.length * 3; // -3 per missing canonical

    if (indexableCount === 0) score -= 20; // Major issue if no indexable pages

    return Math.max(0, score);
};

/**
 * GET /api/seo/breadcrumbs
 * Generate breadcrumbs for a URL
 */
router.get('/breadcrumbs', async (req, res) => {
    try {
        const { yearSlug, subjectSlug, unitSlug, yearTitle, subjectTitle, unitTitle } = req.query;

        const breadcrumbs = URLMapper.generateBreadcrumbs({
            yearSlug,
            subjectSlug,
            unitSlug,
            yearTitle,
            subjectTitle,
            unitTitle
        });

        res.json(breadcrumbs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
