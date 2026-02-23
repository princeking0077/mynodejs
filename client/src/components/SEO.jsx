import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Enhanced SEO Component
 * Based on 'SEO Implementation Guide for LearnPharmacy.in'
 * Supports expanded meta tags, Open Graph, Twitter Cards, and JSON-LD Schema.
 */
const SEO = ({
    title,
    description,
    canonical,
    robots = "index, follow",
    keywords,
    ogType = "website",
    ogImage = "https://learnpharmacy.in/default-og.jpg",
    article,
    breadcrumbs,
    schema
}) => {
    const siteName = "LearnPharmacy.in";
    const fullTitle = title && title.includes(siteName) ? title : `${title ? title + ' | ' : ''}${siteName}`;

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
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="robots" content={robots} />
            {keywords && <meta name="keywords" content={keywords} />}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Language */}
            <html lang="en-IN" />
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

            {/* Breadcrumb Schema */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <script type="application/ld+json">
                    {JSON.stringify(generateBreadcrumbSchema(breadcrumbs))}
                </script>
            )}

            {/* Additional Schema */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
