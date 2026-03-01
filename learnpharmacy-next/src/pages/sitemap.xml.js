function generateSiteMap(subjects, articles) {
  // Base URL - www is canonical
  const URL = 'https://www.learnpharmacy.in';

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static Pages -->
     <url>
       <loc>${URL}</loc>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${URL}/bpharm-syllabus</loc>
       <changefreq>monthly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${URL}/gpat-syllabus</loc>
       <changefreq>monthly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${URL}/year/year-1</loc>
       <changefreq>weekly</changefreq>
       <priority>0.85</priority>
     </url>
     <url>
       <loc>${URL}/year/year-2</loc>
       <changefreq>weekly</changefreq>
       <priority>0.85</priority>
     </url>
     <url>
       <loc>${URL}/year/year-3</loc>
       <changefreq>weekly</changefreq>
       <priority>0.85</priority>
     </url>
     <url>
       <loc>${URL}/year/year-4</loc>
       <changefreq>weekly</changefreq>
       <priority>0.85</priority>
     </url>
     <url>
       <loc>${URL}/about</loc>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>${URL}/contact</loc>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
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

export default function SiteMap() {
  // getServerSideProps will do the heavy lifting
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    const pool = require('../../server/db');

    // 1. Fetch Subject Slugs dynamically from Database
    const [subjectRows] = await pool.query("SELECT title FROM subjects");
    const subjects = subjectRows.map(row => {
      const normalize = (str) =>
        str.toLowerCase()
          .replace(/–/g, '-')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      return { slug: normalize(row.title) };
    });

    // 2. Fetch Content Slugs dynamically from Database
    const [contentRows] = await pool.query("SELECT slug, created_at as updated_at FROM content");
    const articles = contentRows.map(row => ({
      slug: row.slug,
      updated_at: row.updated_at
    }));

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
