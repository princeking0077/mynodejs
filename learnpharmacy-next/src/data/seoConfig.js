// SEO Configuration for LearnPharmacy.in
// Based on "SEO Implementation Guide for LearnPharmacy.in"

// 1.1 Homepage
export const homepageSEO = {
    title: "B Pharm Notes PDF Free Download | GPAT Study Materials | LearnPharmacy.in",
    description: "Download free B Pharmacy notes for all 4 years. GPAT syllabus, handwritten notes, PCI curriculum study materials for pharmacy students in India.",
    canonical: "https://learnpharmacy.in/",
    robots: "index, follow, max-image-preview:large, max-snippet:-1",
    og: {
        type: "website",
        title: "B Pharm Notes & GPAT Study Materials - LearnPharmacy.in",
        description: "India's trusted pharmacy education platform. Free notes for B.Pharm 1st to 4th year students.",
        image: "https://learnpharmacy.in/og-home.jpg",
        url: "https://learnpharmacy.in/"
    },
    twitter: {
        card: "summary_large_image",
        title: "B Pharm Notes PDF Free | LearnPharmacy.in",
        description: "Free pharmacy study materials for B.Pharm & GPAT aspirants"
    },
    keywords: "b pharm notes, pharmacy notes pdf, gpat syllabus, learn pharmacy, b pharmacy study material"
};

// 1.2 Year Hub Pages
export const getYearHubSEO = (yearId) => {
    const yearData = {
        "year-1": {
            title: "B Pharm 1st Year Notes PDF - All Subjects | LearnPharmacy.in",
            description: "Download B.Pharm 1st year notes. Human Anatomy, Pharmaceutics, Pharmaceutical Chemistry, Pharmaceutical Analysis - complete PCI syllabus coverage.",
            h1: "B.Pharm 1st Year - Complete Study Materials",
            keywords: "b pharm 1st year notes, b pharmacy first year subjects, 1st semester notes pdf"
        },
        "year-2": {
            title: "B Pharm 2nd Year Notes PDF - All Subjects | LearnPharmacy.in",
            description: "Download B.Pharm 2nd year notes. Pharmaceutical Organic Chemistry, Physical Pharmaceutics, Microbiology, Pathophysiology - PCI syllabus notes.",
            h1: "B.Pharm 2nd Year - Complete Study Materials",
            keywords: "b pharm 2nd year notes, b pharmacy second year, 3rd 4th semester notes"
        },
        "year-3": {
            title: "B Pharm 3rd Year Notes PDF - All Subjects | LearnPharmacy.in",
            description: "Download B.Pharm 3rd year notes. Medicinal Chemistry, Pharmacology, Pharmacognosy, Pharmaceutical Engineering - exam-oriented study materials.",
            h1: "B.Pharm 3rd Year - Complete Study Materials",
            keywords: "b pharm 3rd year notes, b pharmacy third year, 5th 6th semester notes"
        },
        "year-4": {
            title: "B Pharm 4th Year Notes PDF - All Subjects | LearnPharmacy.in",
            description: "Download B.Pharm 4th year notes. Industrial Pharmacy, Pharmaceutical Analysis, Quality Assurance, Biopharmaceutics - final year study materials.",
            h1: "B.Pharm 4th Year - Complete Study Materials",
            keywords: "b pharm 4th year notes, b pharmacy final year, 7th 8th semester notes"
        }
    };

    const data = yearData[yearId] || {
        title: "B Pharm Notes | LearnPharmacy.in",
        description: "B.Pharm Notes and Study Materials",
        h1: "B.Pharm Study Materials",
        keywords: "b pharm notes"
    };

    return {
        ...data,
        canonical: `https://learnpharmacy.in/year/${yearId}`,
        robots: "index, follow",
        og: {
            type: "website",
            title: data.title,
            description: data.description,
            url: `https://learnpharmacy.in/year/${yearId}`
        }
    };
};

// 1.5 GPAT Pages
export const gpatHubSEO = {
    title: "GPAT Syllabus 2026 - Complete Study Guide & Notes | LearnPharmacy.in",
    description: "GPAT 2026 complete syllabus with module-wise notes. Pharmacology, Pharmaceutics, Medicinal Chemistry study materials for GPAT exam preparation.",
    canonical: "https://learnpharmacy.in/gpat-syllabus",
    robots: "index, follow",
    h1: "GPAT Syllabus 2026 - Exam Preparation Hub",
    keywords: "gpat syllabus 2026, gpat preparation, gpat notes pdf, gpat exam pattern",
    og: {
        type: "website",
        title: "GPAT Syllabus & Notes 2026 | LearnPharmacy.in",
        description: "Complete GPAT preparation guide with module-wise study materials"
    }
};

// 1.6 Static Pages
export const staticPagesSEO = {
    about: {
        title: "About Us - LearnPharmacy.in | Pharmacy Education Platform",
        description: "LearnPharmacy.in is India's trusted platform for B.Pharm notes, GPAT preparation, and pharmacy education resources. Learn about our mission.",
        canonical: "https://learnpharmacy.in/about",
        robots: "index, follow"
    },
    contact: {
        title: "Contact Us - LearnPharmacy.in",
        description: "Contact LearnPharmacy.in for queries about B.Pharm notes, study materials, or collaborations. We're here to help pharmacy students.",
        canonical: "https://learnpharmacy.in/contact",
        robots: "index, follow"
    },
    privacy: {
        title: "Privacy Policy - LearnPharmacy.in",
        description: "Read our privacy policy to understand how LearnPharmacy.in handles your data and protects your privacy.",
        canonical: "https://learnpharmacy.in/privacy-policy",
        robots: "noindex, follow"
    },
    terms: {
        title: "Terms of Service - LearnPharmacy.in",
        description: "Read our terms of service.",
        canonical: "https://learnpharmacy.in/terms",
        robots: "noindex, follow"
    },
    disclaimer: {
        title: "Disclaimer - LearnPharmacy.in",
        description: "Disclaimer for educational content.",
        canonical: "https://learnpharmacy.in/disclaimer",
        robots: "noindex, follow"
    },
    search: {
        title: "Search - LearnPharmacy.in",
        description: "Search for B.Pharm notes, topics, and study materials on LearnPharmacy.in",
        canonical: "https://learnpharmacy.in/search",
        robots: "noindex, follow"
    }
};

// --- Schema Generators ---

// Homepage Schema
export const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "LearnPharmacy.in",
    "alternateName": "Learn Pharmacy",
    "url": "https://learnpharmacy.in",
    "logo": "https://learnpharmacy.in/logo.png",
    "description": "India's trusted educational platform for B Pharmacy notes and GPAT preparation materials",
    "sameAs": [
        "https://www.instagram.com/learnpharmacy",
        "https://t.me/learnpharmacy",
        "https://www.youtube.com/@learnpharmacy"
    ],
    "areaServed": {
        "@type": "Country",
        "name": "India"
    },
    "audience": {
        "@type": "EducationalAudience",
        "educationalRole": "student",
        "audienceType": "Pharmacy Students"
    }
};

// Subject Hub Schema (Course)
export const generateSubjectSchema = (subject, topics = []) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${subject.title || subject.name} - B.Pharm Notes`,
    "description": subject.description || `Study materials for ${subject.title}`,
    "provider": {
        "@type": "EducationalOrganization",
        "name": "LearnPharmacy.in",
        "url": "https://learnpharmacy.in"
    },
    "educationalLevel": "Bachelor",
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "numberOfCredits": 4, // Default assumption
    "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online"
    },
    "syllabusSections": topics.map(topic => ({
        "@type": "Syllabus",
        "name": topic.title
    }))
});

// Topic Page Schema (Article/LearningResource)
export const generateTopicSchema = (subject, topic) => ({
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": topic.title,
    "description": topic.metaDescription || topic.meta_description,
    "url": `https://learnpharmacy.in/${subject.slug}/${topic.slug}`,
    "learningResourceType": "Study Notes",
    "educationalLevel": "Bachelor",
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "datePublished": topic.createdAt || topic.created_at,
    "dateModified": topic.updatedAt || topic.updated_at || topic.createdAt,
    "author": {
        "@type": "Organization",
        "name": "LearnPharmacy.in"
    },
    "publisher": {
        "@type": "Organization",
        "name": "LearnPharmacy.in",
        "logo": {
            "@type": "ImageObject",
            "url": "https://learnpharmacy.in/logo.png"
        }
    },
    "isPartOf": {
        "@type": "Course",
        "name": subject.title || subject.name,
        "url": `https://learnpharmacy.in/${subject.slug}`
    },
    "teaches": topic.targetKeywords || topic.target_keywords || [topic.primaryKeyword || topic.primary_keyword]
});
