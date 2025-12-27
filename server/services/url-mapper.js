/**
 * URL Mapper Service
 * Handles keyword-to-URL mapping, canonical URL generation, and anti-cannibalization
 */
const pool = require('../db');

class URLMapper {
    /**
     * Generate SEO-friendly slug from text
     */
    static generateSlug(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[\s_]+/g, '-')           // Replace spaces and underscores with -
            .replace(/[^\w\-]+/g, '')          // Remove all non-word chars except -
            .replace(/\-\-+/g, '-')            // Replace multiple - with single -
            .replace(/^-+/, '')                // Trim - from start
            .replace(/-+$/, '');               // Trim - from end
    }

    /**
     * Generate B.Pharm canonical URL structure
     * @param {Object} params - { yearSlug, subjectSlug, unitSlug }
     * @returns {string} Canonical URL
     */
    static generateCanonicalURL({ yearSlug, subjectSlug, unitSlug }) {
        const baseURL = process.env.SITE_URL || 'https://learnpharmacy.in';
        let path = '/bpharm';

        if (yearSlug) {
            path += `/${yearSlug}`;
        }
        if (subjectSlug) {
            path += `/${subjectSlug}`;
        }
        if (unitSlug) {
            path += `/${unitSlug}`;
        }

        return `${baseURL}${path}`;
    }

    /**
     * Check if keyword is already mapped to avoid cannibalization
     * @param {string} keyword - Keyword to check
     * @param {number} excludeContentId - Content ID to exclude from check
     * @returns {Promise<{exists: boolean, url: string|null}>}
     */
    static async checkKeywordCannibalization(keyword, excludeContentId = null) {
        const query = excludeContentId
            ? 'SELECT url, content_id FROM keyword_mappings WHERE keyword = ? AND content_id != ?'
            : 'SELECT url, content_id FROM keyword_mappings WHERE keyword = ?';

        const params = excludeContentId ? [keyword, excludeContentId] : [keyword];
        const [rows] = await pool.query(query, params);

        if (rows.length > 0) {
            return { exists: true, url: rows[0].url, contentId: rows[0].content_id };
        }

        return { exists: false, url: null, contentId: null };
    }

    /**
     * Map keyword to URL (save to database)
     * @param {Object} params - { keyword, url, contentId, priority }
     */
    static async mapKeyword({ keyword, url, contentId, priority = 'medium', searchVolume = 0 }) {
        try {
            // Check for existing mapping
            const existing = await this.checkKeywordCannibalization(keyword, contentId);

            if (existing.exists) {
                throw new Error(`Keyword "${keyword}" is already mapped to ${existing.url}`);
            }

            await pool.query(
                'INSERT INTO keyword_mappings (keyword, url, content_id, priority, search_volume) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE url = ?, content_id = ?, priority = ?, search_volume = ?',
                [keyword, url, contentId, priority, searchVolume, url, contentId, priority, searchVolume]
            );

            return { success: true };
        } catch (error) {
            console.error('Error mapping keyword:', error);
            throw error;
        }
    }

    /**
     * Get all keyword mappings
     */
    static async getAllMappings() {
        const [rows] = await pool.query(`
            SELECT 
                km.*,
                c.title as content_title,
                c.slug as content_slug
            FROM keyword_mappings km
            LEFT JOIN content c ON km.content_id = c.id
            ORDER BY km.priority DESC, km.search_volume DESC
        `);
        return rows;
    }

    /**
     * Detect keyword cannibalization across all content
     * Returns array of duplicate keyword entries
     */
    static async detectCannibalization() {
        const [rows] = await pool.query(`
            SELECT 
                primary_keyword,
                GROUP_CONCAT(id) as content_ids,
                GROUP_CONCAT(canonical_url) as urls,
                COUNT(*) as duplicate_count
            FROM content
            WHERE primary_keyword IS NOT NULL
            GROUP BY primary_keyword
            HAVING COUNT(*) > 1
            ORDER BY duplicate_count DESC
        `);

        return rows.map(row => ({
            keyword: row.primary_keyword,
            contentIds: row.content_ids.split(',').map(id => parseInt(id)),
            urls: row.urls.split(','),
            duplicateCount: row.duplicate_count
        }));
    }

    /**
     * Normalize URL for consistency
     */
    static normalizeURL(url) {
        // Remove trailing slashes
        url = url.replace(/\/+$/, '');

        // Ensure lowercase
        url = url.toLowerCase();

        // Remove duplicate slashes
        url = url.replace(/([^:]\/)\/+/g, '$1');

        return url;
    }

    /**
     * Generate breadcrumb path from URL structure
     * @param {Object} params - { yearSlug, subjectSlug, unitSlug, yearTitle, subjectTitle, unitTitle }
     * @returns {Array} Breadcrumb array
     */
    static generateBreadcrumbs({ yearSlug, subjectSlug, unitSlug, yearTitle, subjectTitle, unitTitle }) {
        const breadcrumbs = [
            { name: 'Home', url: '/' },
            { name: 'B.Pharm', url: '/bpharm' }
        ];

        if (yearSlug && yearTitle) {
            breadcrumbs.push({
                name: yearTitle,
                url: `/bpharm/${yearSlug}`
            });
        }

        if (subjectSlug && subjectTitle) {
            breadcrumbs.push({
                name: subjectTitle,
                url: `/bpharm/${yearSlug}/${subjectSlug}`
            });
        }

        if (unitSlug && unitTitle) {
            breadcrumbs.push({
                name: unitTitle,
                url: `/bpharm/${yearSlug}/${subjectSlug}/${unitSlug}`
            });
        }

        return breadcrumbs;
    }

    /**
     * Calculate reading time based on word count
     * @param {number} wordCount
     * @returns {number} Reading time in minutes
     */
    static calculateReadingTime(wordCount) {
        const wordsPerMinute = 200; // Average reading speed
        return Math.ceil(wordCount / wordsPerMinute);
    }

    /**
     * Extract word count from HTML content
     */
    static extractWordCount(htmlContent) {
        if (!htmlContent) return 0;

        // Remove HTML tags
        const text = htmlContent.replace(/<[^>]*>/g, ' ');

        // Remove extra whitespace
        const cleanText = text.replace(/\s+/g, ' ').trim();

        // Count words
        const words = cleanText.split(' ').filter(word => word.length > 0);
        return words.length;
    }
}

module.exports = URLMapper;
