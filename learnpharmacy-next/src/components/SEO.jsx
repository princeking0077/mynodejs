import Head from 'next/head';

/**
 * Enhanced SEO Component with Full Schema.org Support
 * Supports meta tags, Open Graph, Twitter Cards, and JSON-LD Schema
 */
const SEO = ({
    title,
    description,
    canonical,
    robots = "index, follow",
    keywords,
    ogType = "website",
    ogImage = "https://www.learnpharmacy.in/og-image.jpg",
    article,
    breadcrumbs,
    schema,
    noindex = false
}) => {
    const siteName = "LearnPharmacy.in";
    const fullTitle = title && title.includes(siteName) ? title : `${title ? title + ' | ' : ''}${siteName}`;
    const robotsContent = noindex ? "noindex, nofollow" : robots;

    // Organization Schema (always included)
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "LearnPharmacy.in",
        "url": "https://www.learnpharmacy.in",
        "logo": "https://www.learnpharmacy.in/logo.png",
        "description": "India's leading visual pharmacy education platform for B.Pharm and GPAT students.",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "email": "support@learnpharmacy.in"
        }
    };

    // Website Schema (always included)
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "LearnPharmacy.in",
        "url": "https://www.learnpharmacy.in",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.learnpharmacy.in/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    };

    // Helper function for breadcrumbs
    const generateBreadcrumbSchema = (items) => ({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    });

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="robots" content={robotsContent} />
            {keywords && <meta name="keywords" content={keywords} />}
            {canonical && <link rel="canonical" href={canonical} />}
            <meta name="author" content="LearnPharmacy.in Team" />
            <meta name="theme-color" content="#10b981" />
            <meta httpEquiv="content-language" content="en-IN" />

            {/* Open Graph */}
            <meta property="og:type" content={ogType} />
            {canonical && <meta property="og:url" content={canonical} />}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="en_IN" />

            {/* Article-specific OG tags */}
            {article && (
                <>
                    {article.published_time && <meta property="article:published_time" content={article.published_time} />}
                    {article.modified_time && <meta property="article:modified_time" content={article.modified_time} />}
                    {article.section && <meta property="article:section" content={article.section} />}
                </>
            )}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Organization Schema (Global) */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>

            {/* Website Schema (Global) */}
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>

            {/* Breadcrumb Schema */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <script type="application/ld+json">
                    {JSON.stringify(generateBreadcrumbSchema(breadcrumbs))}
                </script>
            )}

            {/* Additional Page-Specific Schema */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Head>
    );
};

export default SEO;
