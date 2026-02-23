/**
 * Schema Generator Service
 * Generates JSON-LD structured data for SEO
 */

class SchemaGenerator {
    /**
     * Generate Organization schema (site-wide)
     */
    static generateOrganizationSchema() {
        return {
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            'name': 'LearnPharmacy.in',
            'url': 'https://learnpharmacy.in',
            'logo': 'https://learnpharmacy.in/logo.png',
            'description': 'Master B.Pharm concepts with 3D animations, simplified notes, and real-time quizzes. The complete visual learning ecosystem.',
            'sameAs': [
                // Add social media URLs when available
            ],
            'contactPoint': {
                '@type': 'ContactPoint',
                'contactType': 'Customer Support',
                'email': 'support@learnpharmacy.in'
            }
        };
    }

    /**
     * Generate Website schema
     */
    static generateWebsiteSchema() {
        return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'LearnPharmacy.in',
            'url': 'https://learnpharmacy.in',
            'potentialAction': {
                '@type': 'SearchAction',
                'target': 'https://learnpharmacy.in/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
            }
        };
    }

    /**
     * Generate Breadcrumb schema
     * @param {Array} breadcrumbs - Array of { name, url }
     */
    static generateBreadcrumbSchema(breadcrumbs) {
        const itemListElements = breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': crumb.name,
            'item': crumb.url.startsWith('http') ? crumb.url : `https://learnpharmacy.in${crumb.url}`
        }));

        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': itemListElements
        };
    }

    /**
     * Generate Article schema for content pages
     * @param {Object} article - Article data
     */
    static generateArticleSchema({
        title,
        description,
        url,
        datePublished,
        dateModified,
        imageUrl,
        authorName = 'LearnPharmacy Team',
        wordCount
    }) {
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            'headline': title,
            'description': description,
            'url': url,
            'datePublished': datePublished,
            'dateModified': dateModified || datePublished,
            'author': {
                '@type': 'Person',
                'name': authorName
            },
            'publisher': {
                '@type': 'Organization',
                'name': 'LearnPharmacy.in',
                'logo': {
                    '@type': 'ImageObject',
                    'url': 'https://learnpharmacy.in/logo.png'
                }
            }
        };

        if (imageUrl) {
            schema.image = imageUrl;
        }

        if (wordCount) {
            schema.wordCount = wordCount;
        }

        return schema;
    }

    /**
     * Generate FAQ schema
     * @param {Array} faqs - Array of { question, answer }
     */
    static generateFAQSchema(faqs) {
        if (!faqs || faqs.length === 0) return null;

        return {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqs.map(faq => ({
                '@type': 'Question',
                'name': faq.question,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': faq.answer
                }
            }))
        };
    }

    /**
     * Generate Course schema for subjects
     * @param {Object} course - Course data
     */
    static generateCourseSchema({
        name,
        description,
        url,
        provider = 'LearnPharmacy.in',
        topics = []
    }) {
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'Course',
            'name': name,
            'description': description,
            'url': url,
            'provider': {
                '@type': 'Organization',
                'name': provider,
                'url': 'https://learnpharmacy.in'
            }
        };

        if (topics.length > 0) {
            schema.hasCourseInstance = topics.map(topic => ({
                '@type': 'CourseInstance',
                'name': topic.title,
                'description': topic.description,
                'url': topic.url
            }));
        }

        return schema;
    }

    /**
     * Generate VideoObject schema for YouTube embeds
     * @param {Object} video - Video data
     */
    static generateVideoSchema({
        name,
        description,
        thumbnailUrl,
        uploadDate,
        duration,
        embedUrl,
        contentUrl
    }) {
        return {
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            'name': name,
            'description': description,
            'thumbnailUrl': thumbnailUrl,
            'uploadDate': uploadDate,
            'duration': duration, // ISO 8601 format: PT1M30S
            'embedUrl': embedUrl,
            'contentUrl': contentUrl || embedUrl
        };
    }

    /**
     * Generate combined schema for a content page
     * Combines Article, Breadcrumb, FAQ, and Video if applicable
     */
    static generateContentPageSchema({
        title,
        description,
        url,
        datePublished,
        dateModified,
        breadcrumbs,
        faqs,
        youtubeId,
        wordCount
    }) {
        const schemas = [];

        // Article schema
        schemas.push(this.generateArticleSchema({
            title,
            description,
            url,
            datePublished,
            dateModified,
            wordCount
        }));

        // Breadcrumb schema
        if (breadcrumbs && breadcrumbs.length > 0) {
            schemas.push(this.generateBreadcrumbSchema(breadcrumbs));
        }

        // FAQ schema
        if (faqs && faqs.length > 0) {
            const faqSchema = this.generateFAQSchema(faqs);
            if (faqSchema) schemas.push(faqSchema);
        }

        // Video schema
        if (youtubeId) {
            schemas.push(this.generateVideoSchema({
                name: title,
                description: description,
                thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
                uploadDate: datePublished,
                embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
                contentUrl: `https://www.youtube.com/watch?v=${youtubeId}`
            }));
        }

        return schemas;
    }

    /**
     * Convert schema object to JSON-LD script tag
     * @param {Object|Array} schema - Schema object or array of schemas
     */
    static toScriptTag(schema) {
        const schemas = Array.isArray(schema) ? schema : [schema];
        return schemas.map(s => ({
            type: 'application/ld+json',
            innerHTML: JSON.stringify(s, null, 0) // Minified for production
        }));
    }
}

module.exports = SchemaGenerator;
