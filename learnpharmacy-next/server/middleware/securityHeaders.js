/**
 * Security headers middleware
 * Implements OWASP security best practices
 */

const securityHeaders = (req, res, next) => {
    // Prevent clickjacking attacks
    res.setHeader('X-Frame-Options', 'DENY');

    // Enable XSS filter in browsers
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Referrer Policy - don't leak sensitive URLs
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Content Security Policy (CSP)
    // Adjust based on your needs
    const cspDirectives = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.google.com https://pagead2.googlesyndication.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https: http:",
        "media-src 'self' https://www.youtube.com",
        "frame-src 'self' https://www.youtube.com https://www.google.com",
        "connect-src 'self' https://www.google-analytics.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests"
    ].join('; ');

    res.setHeader('Content-Security-Policy', cspDirectives);

    // Permissions Policy (formerly Feature Policy)
    const permissionsPolicy = [
        'geolocation=()',
        'microphone=()',
        'camera=()',
        'payment=()',
        'usb=()',
        'magnetometer=()',
        'gyroscope=()',
        'accelerometer=()'
    ].join(', ');

    res.setHeader('Permissions-Policy', permissionsPolicy);

    // Strict Transport Security (HTTPS only)
    // Only enable if using HTTPS
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    // Remove powered-by header to hide tech stack
    res.removeHeader('X-Powered-By');

    next();
};

/**
 * CORS configuration with security in mind
 */
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
            return callback(null, true);
        }

        // Define allowed origins
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:3000',
            'http://localhost:3001'
        ].filter(Boolean);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

/**
 * CSRF Protection middleware
 * Simple token-based CSRF protection
 */
const csrfProtection = () => {
    const tokens = new Map();

    // Cleanup old tokens every hour
    setInterval(() => {
        const now = Date.now();
        for (const [token, timestamp] of tokens.entries()) {
            if (now - timestamp > 3600000) { // 1 hour
                tokens.delete(token);
            }
        }
    }, 3600000);

    return {
        // Generate CSRF token
        generateToken: (req, res, next) => {
            const token = require('crypto').randomBytes(32).toString('hex');
            const sessionId = req.session?.id || req.ip;

            tokens.set(token, {
                sessionId,
                timestamp: Date.now()
            });

            res.locals.csrfToken = token;
            next();
        },

        // Verify CSRF token
        verifyToken: (req, res, next) => {
            // Skip for GET, HEAD, OPTIONS
            if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
                return next();
            }

            const token = req.headers['x-csrf-token'] || req.body._csrf;

            if (!token) {
                return res.status(403).json({
                    success: false,
                    message: 'CSRF token missing'
                });
            }

            const tokenData = tokens.get(token);

            if (!tokenData) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid CSRF token'
                });
            }

            const sessionId = req.session?.id || req.ip;

            if (tokenData.sessionId !== sessionId) {
                return res.status(403).json({
                    success: false,
                    message: 'CSRF token mismatch'
                });
            }

            // Token is valid, remove it (one-time use)
            tokens.delete(token);

            next();
        }
    };
};

module.exports = {
    securityHeaders,
    corsOptions,
    csrfProtection
};
