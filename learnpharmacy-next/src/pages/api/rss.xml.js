// API route for RSS feed
// Access at: /api/rss.xml

export default async function handler(req, res) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learnpharmacy.com';
        const API = process.env.NEXT_PUBLIC_API_URL || '';

        // Fetch latest content
        let latestContent = [];
        try {
            const response = await fetch(`${API}/api/content/recent?limit=50`, {
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                latestContent = await response.json();
            } else {
                // Fallback: fetch all and limit on our end
                const allResponse = await fetch(`${API}/api/content/all`);
                if (allResponse.ok) {
                    const allContent = await allResponse.json();
                    latestContent = allContent
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .slice(0, 50);
                }
            }
        } catch (error) {
            console.error('[RSS] Failed to fetch content:', error);
        }

        const escapeXml = (str) => {
            if (!str) return '';
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        };

        const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>LearnPharmacy - Pharmacy Education & GPAT Preparation</title>
    <link>${baseUrl}</link>
    <description>Comprehensive pharmacy education resources, B.Pharm notes, GPAT preparation materials, and pharmaceutical sciences tutorials.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/icon.png</url>
      <title>LearnPharmacy</title>
      <link>${baseUrl}</link>
    </image>
${latestContent.map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${baseUrl}/articles/${item.slug}</link>
      <guid isPermaLink="true">${baseUrl}/articles/${item.slug}</guid>
      <pubDate>${new Date(item.created_at).toUTCString()}</pubDate>
      <description>${escapeXml(item.description || item.meta_description || '')}</description>
      ${item.blog_content ? `<content:encoded><![CDATA[${item.blog_content}]]></content:encoded>` : ''}
      ${item.subject_id ? `<category>${escapeXml(item.subject_id)}</category>` : ''}
      ${item.primary_keyword ? `<category>${escapeXml(item.primary_keyword)}</category>` : ''}
      <author>noreply@learnpharmacy.com (LearnPharmacy Team)</author>
    </item>`).join('\n')}
  </channel>
</rss>`;

        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
        res.status(200).send(rss);

    } catch (error) {
        console.error('[RSS] Error generating feed:', error);
        res.status(500).json({ error: 'Failed to generate RSS feed' });
    }
}
