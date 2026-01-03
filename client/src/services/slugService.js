import { curriculum } from '../data/curriculum';
import { gpatSyllabus } from '../data/gpatSyllabusData';

// Helper to generate SEO-friendly slugs
export const generateSlug = (text) => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and dashes)
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with dashes
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
};

// Find Content by Slug (Strategy Pattern)
export const resolveSlug = (slug) => {
    // 1. Check GPAT Modules (they usually have explicit URLs like /gpat-pharmacology)
    // The slug passed here will be "gpat-pharmacology" (without slash)
    const gpatModule = gpatSyllabus.find(m => m.url === `/${slug}`);
    if (gpatModule) {
        return { type: 'GPAT_MODULE', data: gpatModule };
    }

    // 2. Check B.Pharm Subjects
    // We need to flatten the curriculum to find the subject
    // We match generated slug of title against the requested slug
    let foundSubject = null;
    let foundYear = null;
    let foundSem = null;

    for (const year of curriculum) {
        if (!year.semesters) continue;
        for (const sem of year.semesters) {
            const subject = sem.subjects.find(sub => generateSlug(sub.title) === slug);
            if (subject) {
                foundSubject = subject;
                foundYear = year;
                foundSem = sem;
                break;
            }
        }
        if (foundSubject) break;
    }

    if (foundSubject) {
        return {
            type: 'SUBJECT',
            data: foundSubject,
            context: { year: foundYear, semester: foundSem }
        };
    }

    return null; // Not found
};
