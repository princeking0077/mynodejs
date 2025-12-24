import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords }) => {
    const siteTitle = "LearnPharmacy.in";
    const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | Visual Pharmacy Education`;
    const defaultDesc = "Master B.Pharm concepts with 3D animations, simplified notes, and real-time quizzes. The complete visual learning ecosystem.";

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDesc} />
            <meta name="keywords" content={keywords || "pharmacy, b.pharm, medical animations, pharmacology notes, learnpharmacy"} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDesc} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDesc} />
        </Helmet>
    );
};

export default SEO;
