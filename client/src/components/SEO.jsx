import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Enhanced SEO Component with JSON-LD Schema Support
 * Handles meta tags, Open Graph, Twitter Cards, and structured data
 */
const SEO = ({
    title,
    description,
    keywords,
    canonicalUrl,
    breadcrumbs,
    schemas = [],
    ogImage,
    noindex = false
}) => {
    const siteTitle = "LearnPharmacy.in";
    const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | Visual Pharmacy Education`;
    const defaultDesc = "Master B.Pharm concepts with 3D animations, simplified notes, and real-time quizzes. The complete visual learning ecosystem.";
    const finalDescription = description || defaultDesc;
    const baseURL = process.env.REACT_APP_SITE_URL || 'https://learnpharmacy.in';
    const finalCanonicalUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : baseURL);
    const defaultOgImage = `${baseURL}/og-image.jpg`; // You'll need to create this

    // Build keywords from breadcrumbs if not provided
    let finalKeywords = keywords;
    if (!keywords && breadcrumbs) {
        finalKeywords = breadcrumbs.map(b => b.name).join(', ') + ', pharmacy, b.pharm, learnpharmacy';
    }

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={finalDescription} />
            {finalKeywords && <meta name="keywords" content={finalKeywords} />}

            {/* Canonical URL */}
            <link rel="canonical" href={finalCanonicalUrl} />

            {/* Robots Meta */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            )}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={finalCanonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={ogImage || defaultOgImage} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={finalCanonicalUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={ogImage || defaultOgImage} />

            {/* Additional SEO Tags */}
            <meta name="author" content="LearnPharmacy Team" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />

            {/* JSON-LD Structured Data */}
            {schemas && schemas.length > 0 && schemas.map((schema, index) => (
                <script key={`schema-${index}`} type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEO;
