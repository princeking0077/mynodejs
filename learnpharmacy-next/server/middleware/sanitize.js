/**
 * Input sanitization middleware to prevent XSS and injection attacks
 */

const sanitizeInput = (value) => {
    if (typeof value === 'string') {
        // Remove potentially dangerous characters and patterns
        return value
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+\s*=/gi, '') // Remove inline event handlers
            .replace(/<!--.*?-->/g, '') // Remove HTML comments
            .trim();
    }
    return value;
};

const sanitizeObject = (obj) => {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }

    if (typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            sanitized[key] = sanitizeObject(value);
        }
        return sanitized;
    }

    return sanitizeInput(obj);
};

/**
 * Middleware to sanitize request body, query, and params
 */
const sanitizeMiddleware = (req, res, next) => {
    try {
        if (req.body) {
            req.body = sanitizeObject(req.body);
        }

        if (req.query) {
            req.query = sanitizeObject(req.query);
        }

        if (req.params) {
            req.params = sanitizeObject(req.params);
        }

        next();
    } catch (error) {
        console.error('[Sanitize] Error:', error);
        res.status(400).json({
            success: false,
            message: 'Invalid input data'
        });
    }
};

/**
 * Validate and sanitize specific fields
 */
const validateFields = (rules) => {
    return (req, res, next) => {
        try {
            const data = req.body;
            const errors = [];

            for (const [field, rule] of Object.entries(rules)) {
                const value = data[field];

                // Required check
                if (rule.required && (value === undefined || value === null || value === '')) {
                    errors.push(`${field} is required`);
                    continue;
                }

                // Skip validation if field is optional and empty
                if (!value && !rule.required) {
                    continue;
                }

                // Type check
                if (rule.type) {
                    const actualType = Array.isArray(value) ? 'array' : typeof value;
                    if (actualType !== rule.type) {
                        errors.push(`${field} must be of type ${rule.type}`);
                        continue;
                    }
                }

                // Min length
                if (rule.minLength && value.length < rule.minLength) {
                    errors.push(`${field} must be at least ${rule.minLength} characters`);
                }

                // Max length
                if (rule.maxLength && value.length > rule.maxLength) {
                    errors.push(`${field} must not exceed ${rule.maxLength} characters`);
                }

                // Pattern match
                if (rule.pattern && !rule.pattern.test(value)) {
                    errors.push(`${field} has invalid format`);
                }

                // Custom validator
                if (rule.validate && !rule.validate(value)) {
                    errors.push(rule.message || `${field} is invalid`);
                }
            }

            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors
                });
            }

            next();
        } catch (error) {
            console.error('[Validate] Error:', error);
            res.status(400).json({
                success: false,
                message: 'Validation error'
            });
        }
    };
};

/**
 * Sanitize HTML content while preserving safe tags
 * Useful for blog content that needs some HTML
 */
const sanitizeHTML = (html, allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'img']) => {
    if (!html || typeof html !== 'string') {
        return html;
    }

    // Remove script tags and event handlers
    let cleaned = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');

    // Only allow specific tags (basic implementation)
    // For production, use a library like DOMPurify on the client or isomorphic-dompurify
    const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    cleaned = cleaned.replace(tagPattern, (match, tag) => {
        if (allowedTags.includes(tag.toLowerCase())) {
            // Remove potentially dangerous attributes
            return match
                .replace(/on\w+\s*=/gi, '')
                .replace(/javascript:/gi, '');
        }
        return ''; // Remove tag if not allowed
    });

    return cleaned;
};

module.exports = {
    sanitizeInput,
    sanitizeObject,
    sanitizeMiddleware,
    validateFields,
    sanitizeHTML
};
