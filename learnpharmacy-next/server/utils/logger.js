const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../../logs');
const ERROR_LOG = path.join(LOG_DIR, 'error.log');
const ACCESS_LOG = path.join(LOG_DIR, 'access.log');
const APP_LOG = path.join(LOG_DIR, 'app.log');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Log levels
 */
const LogLevel = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

/**
 * Format log message
 */
const formatLog = (level, message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaString}\n`;
};

/**
 * Write to log file
 */
const writeToFile = (file, content) => {
    try {
        fs.appendFileSync(file, content, 'utf8');
    } catch (error) {
        console.error('Failed to write to log file:', error);
    }
};

/**
 * Logger class
 */
class Logger {
    constructor(context = 'APP') {
        this.context = context;
    }

    error(message, meta = {}) {
        const log = formatLog(LogLevel.ERROR, `[${this.context}] ${message}`, meta);
        console.error(log.trim());
        writeToFile(ERROR_LOG, log);
        writeToFile(APP_LOG, log);
    }

    warn(message, meta = {}) {
        const log = formatLog(LogLevel.WARN, `[${this.context}] ${message}`, meta);
        console.warn(log.trim());
        writeToFile(APP_LOG, log);
    }

    info(message, meta = {}) {
        const log = formatLog(LogLevel.INFO, `[${this.context}] ${message}`, meta);
        console.log(log.trim());
        writeToFile(APP_LOG, log);
    }

    debug(message, meta = {}) {
        if (process.env.NODE_ENV === 'development') {
            const log = formatLog(LogLevel.DEBUG, `[${this.context}] ${message}`, meta);
            console.log(log.trim());
            writeToFile(APP_LOG, log);
        }
    }

    access(req) {
        const log = formatLog(
            'ACCESS',
            `${req.method} ${req.url}`,
            {
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
                referer: req.headers['referer']
            }
        );
        writeToFile(ACCESS_LOG, log);
    }
}

/**
 * Express middleware for request logging
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    const logger = new Logger('HTTP');

    // Log request
    logger.access(req);

    // Log response
    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = formatLog(
            res.statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO,
            `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`,
            {
                ip: req.ip,
                statusCode: res.statusCode,
                duration: `${duration}ms`
            }
        );

        if (res.statusCode >= 400) {
            writeToFile(ERROR_LOG, log);
        }
        writeToFile(APP_LOG, log);
    });

    next();
};

/**
 * Express error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    const logger = new Logger('ERROR');

    logger.error(err.message || 'Internal server error', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        stack: err.stack,
        body: req.body
    });

    // Don't leak error details in production
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(err.statusCode || 500).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * Rotate log files (run daily)
 */
const rotateLogs = () => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const files = [ERROR_LOG, ACCESS_LOG, APP_LOG];

    files.forEach(file => {
        try {
            if (fs.existsSync(file)) {
                const stats = fs.statSync(file);
                if (stats.size > maxSize) {
                    const timestamp = new Date().toISOString().split('T')[0];
                    const newName = `${file}.${timestamp}`;
                    fs.renameSync(file, newName);
                    fs.writeFileSync(file, ''); // Create new empty file
                }
            }
        } catch (error) {
            console.error('Failed to rotate log file:', error);
        }
    });
};

// Rotate logs daily
setInterval(rotateLogs, 24 * 60 * 60 * 1000);

module.exports = {
    Logger,
    requestLogger,
    errorHandler,
    rotateLogs,
    LogLevel
};
