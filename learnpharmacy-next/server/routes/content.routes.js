const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth.middleware');
const URLMapper = require('../services/url-mapper');
const InternalLinkingEngine = require('../services/internal-linking-engine');
const SitemapGenerator = require('../services/sitemap-generator');
const { sanitizeHtml } = require('../utils/sanitize');

// Helper: Trigger on-demand revalidation
const triggerRevalidation = async (subjectId, slug) => {
    try {
        const revalidateUrl = `http://localhost:3005/api/revalidate?secret=learnpharmacy_revalidate_2024&path=/subjects/${subjectId}`;
        await fetch(revalidateUrl).catch(() => {});
        console.log(`✅ Revalidated: /subjects/${subjectId}`);
    } catch (error) {
        console.error('Revalidation failed:', error.message);
    }
};

// Get content by Subject ID
router.get('/', async (req, res) => {
    const { subject } = req.query;
    if (!subject) return res.status(400).json({ message: "Subject ID required" });

    try {
        const [rows] = await pool.query("SELECT * FROM content WHERE subject_id = ? ORDER BY created_at DESC", [subject]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Database Error", error });
    }
});

// Get Global Content Stats
router.get('/stats', async (req, res) => {
    try {
        // Group by year_slug to identify what belongs to which year
        const [rows] = await pool.query(`
            SELECT year_slug, COUNT(*) as count 
            FROM content 
            GROUP BY year_slug
        `);

        // Also get total count
        const total = rows.reduce((acc, curr) => acc + curr.count, 0);

        // Map rows to friendly object
        const stats = {
            total,
            byYear: rows.reduce((acc, curr) => {
                if (curr.year_slug) acc[curr.year_slug] = curr.count;
                return acc;
            }, {})
        };

        res.json(stats);
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: "Stats Error" });
    }
});

// Search Topics Global (Matches search.php logic)
router.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);

    try {
        // Robust Weighted Algorithmic Search Scoring Without Requiring FULLTEXT indices
        const query = `
            SELECT id, subject_id, title, slug, description, 'topic' as type,
                   (CASE WHEN title LIKE ? THEN 10 ELSE 0 END) +
                   (CASE WHEN subject_id LIKE ? THEN 8 ELSE 0 END) +
                   (CASE WHEN description LIKE ? THEN 5 ELSE 0 END) +
                   (CASE WHEN blog_content LIKE ? THEN 1 ELSE 0 END) as relevance
            FROM content 
            WHERE title LIKE ? 
               OR subject_id LIKE ? 
               OR description LIKE ? 
               OR blog_content LIKE ? 
            ORDER BY relevance DESC, created_at DESC 
            LIMIT 30
        `;
        const st = `%${q}%`;
        const [rows] = await pool.query(query, [st, st, st, st, st, st, st, st]);

        // Ensure slug exists (Fallback logic handled here by assumed DB column)
        const results = rows.map(row => ({
            ...row,
            id: String(row.id),
            subject_id: String(row.subject_id),
            slug: row.slug || row.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        }));

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Search Error", error });
    }
});

// Get Single Topic by Slug
router.get('/:subjectSlug/:topicSlug', async (req, res) => {
    const { subjectSlug, topicSlug } = req.params;
    try {
        const [rows] = await pool.query("SELECT * FROM content WHERE slug = ? AND subject_id = ?", [topicSlug, subjectSlug]);
        if (rows.length === 0) return res.status(404).json({ message: "Topic not found" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching topic" });
    }
});

// Helper: Generate Slug
const generateSlug = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
};

// Create Topic
router.post('/', authenticateToken, async (req, res) => {
    const { subjectId, title, description, blogContent, youtubeId, fileUrl, quiz, metaTitle, metaDescription, faqs, yearSlug, unitNumber, primaryKeyword, targetKeywords } = req.body;
    let slug = generateSlug(title);

    try {
        // Check uniqueness
        const [exists] = await pool.query("SELECT id FROM content WHERE slug = ?", [slug]);
        if (exists.length > 0) {
            slug = `${slug}-${Date.now()}`;
        }

        // Calculate SEO fields automatically
        const wordCount = URLMapper.extractWordCount(blogContent);
        const readingTime = URLMapper.calculateReadingTime(wordCount);
        const canonicalUrl = URLMapper.generateCanonicalURL({
            yearSlug: yearSlug || '1st-year',
            subjectSlug: subjectId,
            unitSlug: slug
        });

        // Generate breadcrumbs
        const breadcrumbPath = JSON.stringify(URLMapper.generateBreadcrumbs({
            yearSlug: yearSlug || '1st-year',
            subjectSlug: subjectId,
            unitSlug: slug,
            yearTitle: yearSlug ? yearSlug.replace(/-/g, ' ').toUpperCase() : '1st Year',
            subjectTitle: title.split('-')[0] || title,
            unitTitle: title
        }));

        // Sanitize incoming HTML to prevent XSS attacks
        const cleanBlogContent = sanitizeHtml(blogContent);

        const [result] = await pool.query(
            `INSERT INTO content (
                subject_id, title, slug, description, blog_content, youtube_id, file_url, quiz_data, 
                meta_title, meta_description, faqs, year_slug, unit_number, primary_keyword, 
                target_keywords, canonical_url, breadcrumb_path, content_word_count, reading_time_minutes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [subjectId, title, slug, description, cleanBlogContent, youtubeId, fileUrl, JSON.stringify(quiz),
                metaTitle, metaDescription, JSON.stringify(faqs || []), yearSlug, unitNumber, primaryKeyword,
                JSON.stringify(targetKeywords || []), canonicalUrl, breadcrumbPath, wordCount, readingTime]
        );

        const contentId = result.insertId;

        // Generate internal links asynchronously
        InternalLinkingEngine.generateLinks(contentId).catch(err =>
            console.error('Internal link generation failed:', err)
        );

        // Invalidate sitemap cache
        SitemapGenerator.invalidateCache('content').catch(err =>
            console.error('Sitemap invalidation failed:', err)
        );

        // Trigger on-demand revalidation for the subject page
        triggerRevalidation(subjectId, slug);

        res.json({ message: "Topic created successfully", slug, id: contentId });
    } catch (error) {
        console.error("Save Topic DB Error:", error);
        res.status(500).json({
            message: "Failed to create topic: " + (error.sqlMessage || error.message),
            code: error.code
        });
    }
});

// Update Topic (Matches update_topic.php)
router.put('/', authenticateToken, async (req, res) => {
    const { id, title, description, blogContent, youtubeId, fileUrl, quiz, metaTitle, metaDescription, faqs, yearSlug, unitNumber, primaryKeyword, targetKeywords } = req.body;

    if (!id || !title) {
        return res.status(400).json({ message: "Incomplete data." });
    }

    try {
        // Recalculate SEO fields
        const wordCount = URLMapper.extractWordCount(blogContent);
        const readingTime = URLMapper.calculateReadingTime(wordCount);

        // Sanitize incoming HTML
        const cleanBlogContent = sanitizeHtml(blogContent);

        let sql = `UPDATE content SET 
            title = ?, description = ?, blog_content = ?, youtube_id = ?, quiz_data = ?, 
            meta_title = ?, meta_description = ?, faqs = ?, content_word_count = ?, 
            reading_time_minutes = ?`;
        const params = [
            title, description, cleanBlogContent, youtubeId, JSON.stringify(quiz),
            metaTitle, metaDescription, JSON.stringify(faqs || []), wordCount, readingTime
        ];

        // Update optional SEO fields if provided
        if (yearSlug !== undefined) {
            sql += ", year_slug = ?";
            params.push(yearSlug);
        }
        if (unitNumber !== undefined) {
            sql += ", unit_number = ?";
            params.push(unitNumber);
        }
        if (primaryKeyword !== undefined) {
            sql += ", primary_keyword = ?";
            params.push(primaryKeyword);
        }
        if (targetKeywords !== undefined) {
            sql += ", target_keywords = ?";
            params.push(JSON.stringify(targetKeywords));
        }
        if (fileUrl !== undefined) {
            sql += ", file_url = ?";
            params.push(fileUrl);
        }

        sql += " WHERE id = ?";
        params.push(id);

        await pool.query(sql, params);

        // Regenerate internal links asynchronously
        InternalLinkingEngine.generateLinks(id).catch(err =>
            console.error('Internal link regeneration failed:', err)
        );

        // Invalidate sitemap cache
        SitemapGenerator.invalidateCache('content').catch(err =>
            console.error('Sitemap invalidation failed:', err)
        );

        // Trigger on-demand revalidation
        const [content] = await pool.query("SELECT subject_id, slug FROM content WHERE id = ?", [id]);
        if (content.length > 0) {
            triggerRevalidation(content[0].subject_id, content[0].slug);
        }

        res.json({ message: "Topic updated successfully" });
    } catch (error) {
        console.error("Update Topic DB Error:", error);
        res.status(500).json({
            message: "Failed to update topic: " + (error.sqlMessage || error.message),
            code: error.code
        });
    }
});

// Delete Topic
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM content WHERE id = ?", [id]);
        res.json({ message: "Topic deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete topic" });
    }
});

module.exports = router;
