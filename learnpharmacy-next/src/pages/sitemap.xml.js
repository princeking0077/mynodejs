function generateSiteMap(subjects, articles) {
    // Base URL
    const URL = 'https://learnpharmacy.in';

    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static URLs -->
     <url>
       <loc>${URL}</loc>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${URL}/about</loc>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${URL}/contact</loc>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>

     <!-- Dynamic Subject URLs -->
     ${subjects
            .map(({ slug }) => {
                return `
       <url>
           <loc>${`${URL}/subjects/${slug}`}</loc>
           <changefreq>weekly</changefreq>
           <priority>0.9</priority>
       </url>
     `;
            })
            .join('')}
       
     <!-- Dynamic Article URLs -->
     ${articles
            .map(({ slug, updated_at }) => {
                // Fallback to ISO string if no date is provided
                const lastMod = updated_at ? new Date(updated_at).toISOString() : new Date().toISOString();
                return `
       <url>
           <loc>${`${URL}/articles/${slug}`}</loc>
           <lastmod>${lastMod}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
            })
            .join('')}
   </urlset>
 `;
}

export function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
    try {
        // 1. Fetch Subject Slugs locally from your curriculum file
        const { curriculum } = await import('../data/curriculum');
        const subjects = [];

        curriculum.forEach((year) => {
            year.semesters.forEach((sem) => {
                sem.subjects.forEach((sub) => {
                    const normalize = (str) =>
                        str
                            .toLowerCase()
                            .replace(/–/g, '-')
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, '');
                    subjects.push({ slug: normalize(sub.title) });
                });
            });
        });

        // 2. Fetch Article Slugs dynamically from your Database API
        const { api } = await import('../services/api');
        let articles = [];
        try {
            // Assume you have an endpoint or utility that returns all available topic slugs
            const allDynamicTopics = await api.getContent('ALL');
            if (Array.isArray(allDynamicTopics)) {
                articles = allDynamicTopics.map((item) => ({
                    slug: item.slug,
                    updated_at: item.updated_at || item.created_at,
                }));
            }
        } catch (e) {
            console.error("Failed to fetch articles for sitemap", e);
        }

        // 3. Generate the XML sitemap string
        const sitemap = generateSiteMap(subjects, articles);

        // 4. Send XML to the browser
        res.setHeader('Content-Type', 'text/xml');
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400'); // Cache for 1h, serve stale for 24h
        res.write(sitemap);
        res.end();

        return {
            props: {},
        };
    } catch (error) {
        console.error("Error generating sitemap:", error);
        res.statusCode = 500;
        res.end();
        return { props: {} };
    }
}
