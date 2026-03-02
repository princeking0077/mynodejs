/**
 * Simple in-memory rate limiter middleware
 * For production, consider using Redis for distributed rate limiting
 */

const rateLimit = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        max = 100, // Limit each IP to 100 requests per windowMs
        message = 'Too many requests, please try again later.',
        statusCode = 429,
        skipSuccessfulRequests = false,
        skipFailedRequests = false
    } = options;

    // Store for tracking requests: { ip: { count: number, resetTime: timestamp } }
    const store = new Map();

    // Cleanup old entries every 60 seconds
    setInterval(() => {
        const now = Date.now();
        for (const [ip, data] of store.entries()) {
            if (now > data.resetTime) {
                store.delete(ip);
            }
        }
    }, 60000);

    return (req, res, next) => {
        // Get client IP
        const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];

        if (!ip) {
            return next();
        }

        const now = Date.now();
        const clientData = store.get(ip);

        // Initialize or reset if window expired
        if (!clientData || now > clientData.resetTime) {
            store.set(ip, {
                count: 1,
                resetTime: now + windowMs
            });
            return next();
        }

        // Increment request count
        clientData.count++;

        // Check if limit exceeded
        if (clientData.count > max) {
            const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
            res.setHeader('Retry-After', retryAfter);
            res.setHeader('X-RateLimit-Limit', max);
            res.setHeader('X-RateLimit-Remaining', 0);
            res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());

            return res.status(statusCode).json({
                success: false,
                message,
                retryAfter: `${retryAfter} seconds`
            });
        }

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', max - clientData.count);
        res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());

        // Handle response to update count if needed
        if (!skipSuccessfulRequests || !skipFailedRequests) {
            const originalSend = res.send;
            res.send = function (data) {
                const shouldSkip =
                    (skipSuccessfulRequests && res.statusCode < 400) ||
                    (skipFailedRequests && res.statusCode >= 400);

                if (shouldSkip) {
                    clientData.count--;
                }

                res.send = originalSend;
                return originalSend.call(this, data);
            };
        }

        next();
    };
};

// Preset configurations
const createRateLimiter = {
    // Strict: 10 requests per 1 minute
    strict: () => rateLimit({ windowMs: 60 * 1000, max: 10, message: 'Rate limit exceeded. Please slow down.' }),

    // Standard: 100 requests per 15 minutes
    standard: () => rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }),

    // Relaxed: 1000 requests per hour
    relaxed: () => rateLimit({ windowMs: 60 * 60 * 1000, max: 1000 }),

    // Auth: 5 login attempts per 15 minutes
    auth: () => rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5,
        message: 'Too many login attempts. Please try again later.',
        skipSuccessfulRequests: true
    }),

    // API: 300 requests per 15 minutes
    api: () => rateLimit({ windowMs: 15 * 60 * 1000, max: 300 })
};

module.exports = { rateLimit, createRateLimiter };
