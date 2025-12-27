/**
 * Internal Linking Engine
 * Automatically generates contextual internal links for SEO and user experience
 */
const pool = require('../db');

class InternalLinkingEngine {
    /**
     * Generate all internal links for a piece of content
     * Returns: { parentLink, siblingLinks, relatedLinks, prevNextLinks }
     */
    static async generateLinks(contentId) {
        const [content] = await pool.query(
            'SELECT * FROM content WHERE id = ?',
            [contentId]
        );

        if (content.length === 0) {
            throw new Error('Content not found');
        }

        const item = content[0];
        const links = {
            parent: await this.getParentLink(item),
            siblings: await this.getSiblingLinks(item, contentId),
            related: await this.getRelatedLinks(item, contentId),
            prevNext: await this.getPrevNextLinks(item, contentId)
        };

        // Save generated links to database
        await pool.query(
            'UPDATE content SET internal_links = ? WHERE id = ?',
            [JSON.stringify(links), contentId]
        );

        return links;
    }

    /**
     * Get parent link (back to subject/year page)
     */
    static async getParentLink(content) {
        // If this is a unit page, parent is the subject page
        // Otherwise, parent is the year page or home

        const { year_slug, subject_id, slug } = content;

        if (!year_slug) return { title: 'B.Pharm Hub', url: '/bpharm' };

        // Find subject if available
        if (subject_id) {
            return {
                title: `Back to ${subject_id}`,
                url: `/bpharm/${year_slug}/${subject_id}`,
                anchor: `Back to ${subject_id}`
            };
        }

        // Otherwise year page
        return {
            title: `Back to ${year_slug}`,
            url: `/bpharm/${year_slug}`,
            anchor: `Back to ${year_slug}`
        };
    }

    /**
     * Get sibling links (same subject, different units)
     */
    static async getSiblingLinks(content, excludeId) {
        const { subject_id, year_slug } = content;

        if (!subject_id) return [];

        const [siblings] = await pool.query(
            `SELECT id, title, slug, unit_number 
             FROM content 
             WHERE subject_id = ? AND id != ? AND year_slug = ?
             ORDER BY unit_number ASC, created_at ASC
             LIMIT 5`,
            [subject_id, excludeId, year_slug]
        );

        return siblings.map(s => ({
            title: s.title,
            url: `/bpharm/${year_slug}/${subject_id}/${s.slug}`,
            anchor: s.title,
            unitNumber: s.unit_number
        }));
    }

    /**
     * Get related content based on keyword similarity
     */
    static async getRelatedLinks(content, excludeId) {
        const { primary_keyword, target_keywords } = content;

        if (!primary_keyword && (!target_keywords || target_keywords.length === 0)) {
            return [];
        }

        // Build keyword list for similarity matching
        const keywords = [primary_keyword];
        if (target_keywords) {
            try {
                const parsedKeywords = typeof target_keywords === 'string'
                    ? JSON.parse(target_keywords)
                    : target_keywords;
                keywords.push(...parsedKeywords);
            } catch (e) {
                // Ignore parse errors
            }
        }

        // Find content with overlapping keywords
        const [related] = await pool.query(
            `SELECT id, title, slug, subject_id, year_slug, primary_keyword
             FROM content
             WHERE id != ? 
             AND (
                 primary_keyword IN (?)
                 OR JSON_OVERLAPS(target_keywords, ?)
             )
             LIMIT 3`,
            [excludeId, keywords, JSON.stringify(keywords)]
        );

        return related.map(r => ({
            title: r.title,
            url: `/bpharm/${r.year_slug}/${r.subject_id}/${r.slug}`,
            anchor: `Learn about ${r.primary_keyword || r.title}`,
            keyword: r.primary_keyword
        }));
    }

    /**
     * Get previous and next sequential links (for unit progression)
     */
    static async getPrevNextLinks(content, currentId) {
        const { subject_id, unit_number, year_slug } = content;

        if (!subject_id || !unit_number) return { prev: null, next: null };

        // Get previous unit
        const [prevResult] = await pool.query(
            `SELECT id, title, slug, unit_number
             FROM content
             WHERE subject_id = ? AND year_slug = ? AND unit_number < ?
             ORDER BY unit_number DESC
             LIMIT 1`,
            [subject_id, year_slug, unit_number]
        );

        // Get next unit
        const [nextResult] = await pool.query(
            `SELECT id, title, slug, unit_number
             FROM content
             WHERE subject_id = ? AND year_slug = ? AND unit_number > ?
             ORDER BY unit_number ASC
             LIMIT 1`,
            [subject_id, year_slug, unit_number]
        );

        return {
            prev: prevResult[0] ? {
                title: prevResult[0].title,
                url: `/bpharm/${year_slug}/${subject_id}/${prevResult[0].slug}`,
                anchor: `← Previous: ${prevResult[0].title}`,
                unitNumber: prevResult[0].unit_number
            } : null,
            next: nextResult[0] ? {
                title: nextResult[0].title,
                url: `/bpharm/${year_slug}/${subject_id}/${nextResult[0].slug}`,
                anchor: `Next: ${nextResult[0].title} →`,
                unitNumber: nextResult[0].unit_number
            } : null
        };
    }

    /**
     * Detect orphan pages (pages with no incoming internal links)
     */
    static async detectOrphanPages() {
        // Get all content IDs
        const [allContent] = await pool.query('SELECT id, title, canonical_url FROM content');

        // Get all content with internal_links
        const [withLinks] = await pool.query(
            'SELECT id, internal_links FROM content WHERE internal_links IS NOT NULL'
        );

        // Extract all linked content IDs
        const linkedIds = new Set();
        withLinks.forEach(item => {
            try {
                const links = typeof item.internal_links === 'string'
                    ? JSON.parse(item.internal_links)
                    : item.internal_links;

                // Add IDs from all link types
                ['siblings', 'related', 'prevNext'].forEach(type => {
                    if (links[type]) {
                        if (Array.isArray(links[type])) {
                            links[type].forEach(link => linkedIds.add(link.id));
                        } else if (type === 'prevNext') {
                            if (links[type].prev) linkedIds.add(links[type].prev.id);
                            if (links[type].next) linkedIds.add(links[type].next.id);
                        }
                    }
                });
            } catch (e) {
                // Ignore parse errors
            }
        });

        // Find orphans (pages not in linkedIds set)
        const orphans = allContent.filter(item => !linkedIds.has(item.id));

        return orphans.map(item => ({
            id: item.id,
            title: item.title,
            url: item.canonical_url
        }));
    }

    /**
     * Regenerate all internal links for entire site
     * Use this after bulk content updates
     */
    static async regenerateAllLinks() {
        const [allContent] = await pool.query('SELECT id FROM content');

        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const item of allContent) {
            try {
                await this.generateLinks(item.id);
                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push({
                    contentId: item.id,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * Get link recommendations for admin (shows where to add manual links)
     */
    static async getLinkRecommendations(contentId) {
        const links = await this.generateLinks(contentId);
        const [content] = await pool.query('SELECT content_word_count FROM content WHERE id = ?', [contentId]);

        const wordCount = content[0]?.content_word_count || 0;
        const recommendedLinkCount = Math.max(3, Math.floor(wordCount / 400)); // 1 link per 400 words

        const totalLinks =
            (links.siblings?.length || 0) +
            (links.related?.length || 0) +
            (links.prevNext.prev ? 1 : 0) +
            (links.prevNext.next ? 1 : 0);

        return {
            currentLinkCount: totalLinks,
            recommendedLinkCount,
            needsMoreLinks: totalLinks < recommendedLinkCount,
            suggestions: links
        };
    }
}

module.exports = InternalLinkingEngine;
