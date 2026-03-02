// API route for dynamic sitemap generation
// Access at: /api/sitemap.xml

export default async function handler(req, res) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learnpharmacy.com';
        const API = process.env.NEXT_PUBLIC_API_URL || '';

        // Fetch all content from API
        let allContent = [];
        try {
            const response = await fetch(`${API}/api/content/all`, {
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                allContent = await response.json();
            }
        } catch (error) {
            console.error('[Sitemap] Failed to fetch content:', error);
        }

        // Static pages
        const staticPages = [
            { url: '', changefreq: 'daily', priority: 1.0 },
            { url: '/about', changefreq: 'monthly', priority: 0.8 },
            { url: '/contact', changefreq: 'monthly', priority: 0.7 },
            { url: '/bpharm-syllabus', changefreq: 'weekly', priority: 0.9 },
            { url: '/gpat-syllabus', changefreq: 'weekly', priority: 0.9 },
            { url: '/gpat-tests', changefreq: 'weekly', priority: 0.9 },
        ];

        // Generate XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
${allContent.map(item => `  <url>
    <loc>${baseUrl}/articles/${item.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${item.updated_at || item.created_at || new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`;

        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
        res.status(200).send(sitemap);

    } catch (error) {
        console.error('[Sitemap] Error generating sitemap:', error);
        res.status(500).json({ error: 'Failed to generate sitemap' });
    }
}
