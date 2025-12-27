/**
 * Sitemap Generator Service
 * Generates XML sitemaps for Google Search Console
 */
const pool = require('../db');
const URLMapper = require('./url-mapper');

class SitemapGenerator {
    /**
     * Generate complete sitemap index
     */
    static async generateSitemapIndex() {
        const baseURL = process.env.SITE_URL || 'https://learnpharmacy.in';

        const sitemaps = [
            { loc: `${baseURL}/sitemap-core.xml`, lastmod: new Date().toISOString() },
            { loc: `${baseURL}/sitemap-content.xml`, lastmod: new Date().toISOString() }
        ];

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        sitemaps.forEach(sitemap => {
            xml += '  <sitemap>\n';
            xml += `    <loc>${sitemap.loc}</loc>\n`;
            xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
            xml += '  </sitemap>\n';
        });

        xml += '</sitemapindex>';

        // Cache the sitemap
        await this.cacheSitemap('index', xml, sitemaps.length);

        return xml;
    }

    /**
     * Generate core sitemap (homepage, main hubs, policy pages)
     */
    static async generateCoreSitemap() {
        const baseURL = process.env.SITE_URL || 'https://learnpharmacy.in';

        const corePages = [
            { url: '/', priority: 1.0, changefreq: 'daily' },
            { url: '/bpharm', priority: 1.0, changefreq: 'weekly' },
            { url: '/bpharm/1st-year', priority: 0.9, changefreq: 'weekly' },
            { url: '/bpharm/2nd-year', priority: 0.9, changefreq: 'weekly' },
            { url: '/bpharm/3rd-year', priority: 0.9, changefreq: 'weekly' },
            { url: '/bpharm/4th-year', priority: 0.9, changefreq: 'weekly' },
            { url: '/about', priority: 0.7, changefreq: 'monthly' },
            { url: '/contact', priority: 0.7, changefreq: 'monthly' },
            { url: '/privacy', priority: 0.5, changefreq: 'yearly' },
            { url: '/terms', priority: 0.5, changefreq: 'yearly' },
            { url: '/disclaimer', priority: 0.5, changefreq: 'yearly' }
        ];

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        corePages.forEach(page => {
            xml += '  <url>\n';
            xml += `    <loc>${baseURL}${page.url}</loc>\n`;
            xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += '  </url>\n';
        });

        xml += '</urlset>';

        await this.cacheSitemap('core', xml, corePages.length);

        return xml;
    }

    /**
     * Generate content sitemap (all dynamic content pages)
     */
    static async generateContentSitemap() {
        const baseURL = process.env.SITE_URL || 'https://learnpharmacy.in';

        // Get all indexable content
        const [content] = await pool.query(`
            SELECT 
                id,
                canonical_url,
                priority,
                changefreq,
                last_seo_update,
                created_at
            FROM content
            WHERE is_indexable = TRUE
            ORDER BY priority DESC, created_at DESC
        `);

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        content.forEach(item => {
            const url = item.canonical_url || `${baseURL}/content/${item.id}`;
            const lastmod = item.last_seo_update || item.created_at;
            const priority = item.priority || 0.8;
            const changefreq = item.changefreq || 'monthly';

            xml += '  <url>\n';
            xml += `    <loc>${url}</loc>\n`;
            xml += `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>\n`;
            xml += `    <changefreq>${changefreq}</changefreq>\n`;
            xml += `    <priority>${priority}</priority>\n`;
            xml += '  </url>\n';
        });

        xml += '</urlset>';

        await this.cacheSitemap('content', xml, content.length);

        return xml;
    }

    /**
     * Cache sitemap in database for performance
     */
    static async cacheSitemap(type, xmlContent, urlsCount) {
        await pool.query(`
            INSERT INTO sitemap_cache (sitemap_type, xml_content, urls_count, last_generated)
            VALUES (?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE 
                xml_content = VALUES(xml_content),
                urls_count = VALUES(urls_count),
                last_generated = NOW()
        `, [type, xmlContent, urlsCount]);
    }

    /**
     * Get cached sitemap (for performance)
     * @param {string} type - 'core', 'content', or 'index'
     * @param {number} maxAgeHours - Maximum age in hours before regeneration
     */
    static async getCachedSitemap(type, maxAgeHours = 24) {
        const [cached] = await pool.query(`
            SELECT xml_content, last_generated
            FROM sitemap_cache
            WHERE sitemap_type = ?
            AND last_generated > DATE_SUB(NOW(), INTERVAL ? HOUR)
        `, [type, maxAgeHours]);

        return cached[0]?.xml_content || null;
    }

    /**
     * Get sitemap (with caching)
     */
    static async getSitemap(type = 'index') {
        // Try cache first
        const cached = await this.getCachedSitemap(type);
        if (cached) return cached;

        // Generate fresh sitemap
        switch (type) {
            case 'index':
                return await this.generateSitemapIndex();
            case 'core':
                return await this.generateCoreSitemap();
            case 'content':
                return await this.generateContentSitemap();
            default:
                throw new Error(`Invalid sitemap type: ${type}`);
        }
    }

    /**
     * Invalidate sitemap cache (call after content updates)
     */
    static async invalidateCache(type = 'all') {
        if (type === 'all') {
            await pool.query('DELETE FROM sitemap_cache');
        } else {
            await pool.query('DELETE FROM sitemap_cache WHERE sitemap_type = ?', [type]);
        }
    }

    /**
     * Generate robots.txt content
     */
    static generateRobotsTxt() {
        const baseURL = process.env.SITE_URL || 'https://learnpharmacy.in';

        return `# LearnPharmacy.in robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

# Allow CSS and JS for rendering
Allow: /*.css$
Allow: /*.js$
Allow: /*.woff$
Allow: /*.woff2$

# Googlebot and AdSense bot
User-agent: Googlebot
Allow: /

User-agent: Mediapartners-Google
Allow: /

# Sitemap
Sitemap: ${baseURL}/sitemap-index.xml
`;
    }

    /**
     * Get sitemap statistics
     */
    static async getStatistics() {
        const [stats] = await pool.query(`
            SELECT 
                sitemap_type,
                urls_count,
                last_generated,
                TIMESTAMPDIFF(HOUR, last_generated, NOW()) as hours_old
            FROM sitemap_cache
        `);

        return stats;
    }
}

module.exports = SitemapGenerator;
