// SEO Configuration for LearnPharmacy.in
// This centralizes all SEO settings for the website

const SEO_CONFIG = {
  defaultTitle: 'B.Pharm Notes & GPAT Preparation | LearnPharmacy.in',
  titleTemplate: '%s | LearnPharmacy.in',
  defaultDescription: "India's #1 free B.Pharm notes platform covering all 8 semesters with 3D animations, interactive quizzes, and GPAT preparation. Ace pharmacy exams with simplified visual learning.",

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://learnpharmacy.in',
    site_name: 'LearnPharmacy.in',
    title: 'LearnPharmacy.in - Visual Pharmacy Education',
    description: "India's best free B.Pharm notes with 3D animations, quizzes & GPAT prep.",
    images: [
      {
        url: 'https://learnpharmacy.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LearnPharmacy.in - Visual Pharmacy Education',
      },
    ],
  },

  twitter: {
    handle: '@learnpharmacy',
    site: '@learnpharmacy',
    cardType: 'summary_large_image',
  },

  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=5',
    },
    {
      name: 'keywords',
      content: 'B.Pharm notes, pharmacy notes, GPAT preparation, PCI syllabus, pharmacy education, pharmaceutical sciences, D.Pharm notes, pharmacology notes, pharmaceutical chemistry',
    },
    {
      name: 'author',
      content: 'LearnPharmacy.in Team',
    },
    {
      name: 'theme-color',
      content: '#10b981',
    },
    {
      httpEquiv: 'x-ua-compatible',
      content: 'IE=edge',
    },
  ],

  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/icon.png',
      sizes: '192x192',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ],
};

// Schema.org structured data templates
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'LearnPharmacy.in',
  url: 'https://learnpharmacy.in',
  logo: 'https://learnpharmacy.in/logo.png',
  description: "India's leading visual pharmacy education platform for B.Pharm and GPAT students.",
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'support@learnpharmacy.in',
  },
  sameAs: [
    // Add social media links when available
  ],
});

export const generateWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'LearnPharmacy.in',
  url: 'https://learnpharmacy.in',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://learnpharmacy.in/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
});

export const generateCourseSchema = (courseData) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: courseData.name,
  description: courseData.description,
  provider: {
    '@type': 'Organization',
    name: 'LearnPharmacy.in',
    url: 'https://learnpharmacy.in',
  },
  educationalLevel: 'Undergraduate',
  inLanguage: 'en-IN',
  courseCode: courseData.code,
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    courseWorkload: courseData.duration || 'PT4Y', // 4 years for B.Pharm
  },
});

export const generateArticleSchema = (article) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  image: article.image || 'https://learnpharmacy.in/og-image.jpg',
  datePublished: article.publishedDate,
  dateModified: article.modifiedDate || article.publishedDate,
  author: {
    '@type': 'Organization',
    name: 'LearnPharmacy.in',
  },
  publisher: {
    '@type': 'Organization',
    name: 'LearnPharmacy.in',
    logo: {
      '@type': 'ImageObject',
      url: 'https://learnpharmacy.in/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': article.url,
  },
});

export const generateBreadcrumbSchema = (breadcrumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: `https://learnpharmacy.in${crumb.path}`,
  })),
});

export const generateFAQSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export default SEO_CONFIG;
