const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');

// --- SERVER-SIDE BOOTSTRAP PROTECTION ---
// Hostinger often runs this file directly, so we must protect it here too.
const logCrash = (type, err) => {
    const report = `
    TIME: ${new Date().toISOString()}
    TYPE: ${type}
    MESSAGE: ${err.message || err}
    STACK: ${err.stack || 'No stack trace'}
    \n`;
    try {
        // Write to BOTH locations to be safe
        fs.appendFileSync(path.join(__dirname, 'server_crash_report.txt'), report);
        fs.appendFileSync(path.join(__dirname, '../crash_report.txt'), report); // Try parent too
    } catch (fsErr) {
        console.error('Failed to write crash report:', fsErr);
    }
};

// AUTO-CLEANUP: Remove conflicting server/node_modules if present
// This deletes ITSELF recursively if executed from within the bad folder?
// No, this file is in 'server/index.js', we want to delete 'server/node_modules' relative to 'server/'??
// Wait, the structure is ROOT/server/node_modules.
// If we are IN ROOT/server/index.js, then node_modules is ./node_modules
try {
    const stalePath = path.join(__dirname, 'node_modules');
    if (fs.existsSync(stalePath)) {
        console.log('[Fix] Removing stale server/node_modules...');
        fs.rmSync(stalePath, { recursive: true, force: true });
        console.log('[Fix] Cleanup Complete.');
    }
} catch (e) {
    console.error('[Warning] Cleanup failed:', e.message);
    logCrash('CLEANUP_ERROR', e);
}
// ----------------------------------------
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const pool = require('./db');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// New Security & Monitoring Middleware
const { createRateLimiter } = require('./middleware/rateLimit');
const { sanitizeMiddleware } = require('./middleware/sanitize');
const { securityHeaders } = require('./middleware/securityHeaders');
const { requestLogger, errorHandler, Logger } = require('./utils/logger');

const logger = new Logger('SERVER');

// Bump this value on deploy-related changes. Used to verify Hostinger is running the latest code.
const DEPLOY_MARKER = '2026-01-04T00:00:00.000Z';

// Will be populated once the frontend build path is resolved.
const frontendResolved = {
    label: null,
    buildPath: null,
    indexHtmlMtimeMs: null
};

console.log("----- SERVER STARTING -----");
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${process.env.PORT}`);

// Global Error Handlers
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
});

// Ensure uploads dir
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const app = express();

// Security & Logging Middleware (Apply first)
app.use(securityHeaders);
app.use(requestLogger);
app.use(sanitizeMiddleware);

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Allow inline scripts for React/Images
    xRobotsTag: false // Allow Googlebot and AdSense to crawl
}));
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
    origin: ['https://www.learnpharmacy.in', 'http://localhost:3000', 'https://187.77.191.122:3000', 'http://187.77.191.122:3000', 'http://localhost:3005'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(cookieParser());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));

// Rate limiting for API routes
app.use('/api/auth', createRateLimiter.auth());
app.use('/api', createRateLimiter.api());

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/content', require('./routes/content.routes'));
app.use('/api/content', require('./routes/public.routes')); // Public routes (all, recent, stats)
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/seo', require('./routes/seo.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/health', require('./routes/health.routes'));
app.use('/api/subjects', require('./routes/subjects.routes'));
app.use('/api/quiz', require('./routes/quiz.routes'));
// app.use('/', require('./routes/ads.routes')); 

// SEO Endpoints (serve at root level for Google)
app.get('/sitemap-index.xml', async (req, res) => {
    try {
        const SitemapGenerator = require('./services/sitemap-generator');
        const xml = await SitemapGenerator.getSitemap('index');
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Sitemap index error:', error);
        res.status(500).send('Error generating sitemap');
    }
});

app.get('/sitemap-core.xml', async (req, res) => {
    try {
        const SitemapGenerator = require('./services/sitemap-generator');
        const xml = await SitemapGenerator.getSitemap('core');
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        res.status(500).send('Error generating sitemap');
    }
});

app.get('/sitemap-content.xml', async (req, res) => {
    try {
        const SitemapGenerator = require('./services/sitemap-generator');
        const xml = await SitemapGenerator.getSitemap('content');
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        res.status(500).send('Error generating sitemap');
    }
});

app.get('/robots.txt', (req, res) => {
    try {
        const SitemapGenerator = require('./services/sitemap-generator');
        const robotsTxt = SitemapGenerator.generateRobotsTxt();
        res.header('Content-Type', 'text/plain');
        res.send(robotsTxt);
    } catch (error) {
        res.status(500).send('Error generating robots.txt');
    }
});

// Health & Debug
app.get('/api/health', (req, res) => res.json({ message: "Pharma Server Running" }));
app.get('/api/ping', (req, res) => res.send("PONG - Production Server Alive (v2.0 - 200MB Limit)"));

// Deployment verification
app.get('/api/version', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.json({
        deployMarker: DEPLOY_MARKER,
        serverTime: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV || null,
        frontend: {
            label: frontendResolved.label,
            indexHtmlMtimeMs: frontendResolved.indexHtmlMtimeMs
        },
        checks: {
            serverClientBuildExists: fs.existsSync(path.join(__dirname, 'client_build')),
            rootClientDistExists: fs.existsSync(path.join(__dirname, '../client/dist')),
            cwdClientDistExists: fs.existsSync(path.join(process.cwd(), 'client/dist')),
            cwdDistExists: fs.existsSync(path.join(process.cwd(), 'dist'))
        }
    });
});

app.get('/api/debug-status', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT count(*) as count FROM users");
        const [content] = await pool.query("SELECT count(*) as count FROM content");
        res.json({ status: "OK", db: process.env.DB_NAME, users: rows[0].count, content: content[0].count });
    } catch (e) {
        res.status(500).json({ status: "ERROR", error: e.message });
    }
});

// --- DIAGNOSTICS ENDPOINT (Added for debugging) ---
app.get('/test-db', async (req, res) => {
    try {
        const pool = require('./db');
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT 1 as val');
        connection.release();
        res.status(200).json({ status: 'success', message: 'DB Connected!', val: rows[0].val, version: 'IPv4-Enforced', connection_host: '127.0.0.1' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message, version: 'IPv4-Enforced', hint: 'If you see ::1, the code is NOT updated.' });
    }
});
// --------------------------------------------------

// AUTO-MIGRATION: Fix Schema on Startup
(async () => {
    try {
        const connection = await pool.getConnection(); // Use the existing pool

        // 1. Fix blog_content type
        try {
            await connection.query("ALTER TABLE content MODIFY COLUMN blog_content LONGTEXT");
            console.log("✅ SCHEMA: blog_content -> LONGTEXT");
        } catch (e) { }

        // 2. Add Missing SEO Columns
        const addCol = async (col) => {
            try {
                await connection.query(`ALTER TABLE content ADD COLUMN ${col}`);
                console.log(`✅ SCHEMA: Added ${col}`);
            } catch (e) { }
        };

        await addCol("meta_title VARCHAR(255)");
        await addCol("meta_description TEXT");
        await addCol("faqs JSON");
        await addCol("year_slug VARCHAR(50)");
        await addCol("unit_number INT");
        await addCol("primary_keyword VARCHAR(255)");
        await addCol("target_keywords JSON");
        await addCol("canonical_url VARCHAR(500)");
        await addCol("breadcrumb_path JSON");
        await addCol("content_word_count INT DEFAULT 0");
        await addCol("reading_time_minutes INT DEFAULT 0");
        await addCol("slug VARCHAR(255) UNIQUE");
        await addCol("youtube_id VARCHAR(50)");
        await addCol("quiz_data JSON");

        connection.release();
    } catch (e) {
        console.log("ℹ️ Schema Auto-Fix Failed:", e.message);
    }
})();

// AUTO-RUN SEO MIGRATION ON FIRST STARTUP
(async () => {
    const migrationLockFile = path.join(__dirname, 'migrations', '.seo-migration-completed');

    // Check if migration already ran
    if (fs.existsSync(migrationLockFile)) {
        console.log('ℹ️ SEO migration already completed (lock file exists)');
        return;
    }

    console.log('🔄 Running SEO migration automatically (first startup)...');

    try {
        const migrateSEOFields = require('./migrations/add-seo-fields');
        await migrateSEOFields();

        // Create lock file to prevent re-running
        fs.writeFileSync(migrationLockFile, new Date().toISOString());
        console.log('✅ SEO migration completed successfully!');
    } catch (error) {
        console.error('❌ SEO migration failed:', error.message);
        console.error('⚠️ Site may not function correctly. Check database connection.');
        // Don't crash server, just log error
    }
})();

// AUTO-REGENERATE INTERNAL LINKS ON STARTUP (Ensures new URL structure is applied)
(async () => {
    // Wait 5s to allow server to stabilize
    await new Promise(r => setTimeout(r, 5000));
    console.log('🔄 Triggering auto-regeneration of internal links...');
    try {
        const InternalLinkingEngine = require('./services/internal-linking-engine');
        const result = await InternalLinkingEngine.regenerateAllLinks();
        console.log(`✅ Internal links regenerated: ${result.success} success, ${result.failed} failed.`);
    } catch (e) {
        console.error('⚠️ Auto-regeneration of links failed:', e.message);
    }

    // AUTO-SEED GPAT TOPICS (Runs after link regen)
    await new Promise(r => setTimeout(r, 2000)); // Wait another 2s
    console.log('🔄 Triggering GPAT Topics Seed...');
    try {
        const { seedGpatTopics } = require('./seed_gpat_topics');
        await seedGpatTopics(pool);
    } catch (e) {
        console.error('⚠️ GPAT Seeding failed:', e.message);
    }

    // AUTO-SEED B.PHARM SYLLABUS (Runs after GPAT)
    await new Promise(r => setTimeout(r, 2000)); // Wait another 2s
    console.log('🔄 Triggering B.Pharm Syllabus Seed...');
    try {
        const seedBPharmSyllabus = require('./seed_bpharm_syllabus');
        await seedBPharmSyllabus();
    } catch (e) {
        console.error('⚠️ B.Pharm Seeding failed:', e.message);
    }
})();

app.get('/reset-admin', async (req, res) => {
    try {
        const pool = require('./db');
        const bcrypt = require('bcryptjs');
        const connection = await pool.getConnection();

        const email = 'shoaib.ss300@gmail.com';
        const rawPassword = 'Shaikh@#$001';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // Check if user exists
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        let message = '';
        if (rows.length > 0) {
            await connection.execute('UPDATE users SET password = ?, role = ? WHERE email = ?', [hashedPassword, 'admin', email]);
            message = 'Admin Password UPDATED successfully.';
        } else {
            // Check if users table exists first (simple check)
            try {
                await connection.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Shoaib Shaikh', email, hashedPassword, 'admin']);
                message = 'Admin User CREATED successfully.';
            } catch (err) {
                // Maybe table doesn't exist? Try creating it?
                // optimizing for speed: assume table exists per previous context
                throw err;
            }
        }

        connection.release();
        res.status(200).json({ status: 'success', message: message, credentials: { email, password: rawPassword } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// --- NEXT.JS SSR INTEGRATION (OPTION A) ---
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');

// 1. Boot Next.js in the background on Port 3005 to prevent EADDRINUSE
const nextPort = 3005;
console.log(`\n🚀 [PROXY] Spawning Next.js SSR Server on internal port ${nextPort}...`);

try {
    const nextjsPath = path.join(__dirname, '../learnpharmacy-next');
    // Graceful npm process wrapper that accounts for windows/linux differences
    const npmCmd = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
    const nextProcess = spawn(npmCmd, ['run', 'start'], {
        cwd: nextjsPath,
        stdio: 'inherit',
        env: { ...process.env, PORT: nextPort }
    });

    nextProcess.on('error', (err) => {
        console.error('❌ [PROXY] Failed to spawn Next.js process:', err);
    });

    // Auto-kill Next.js when Express crashes
    process.on('exit', () => nextProcess.kill());
} catch (e) {
    console.error('❌ [PROXY] Exception while spawning Next.js:', e);
}

// 2. Proxy all Front-End & SSR traffic to Next.js Process
app.use('*', createProxyMiddleware({
    target: `http://127.0.0.1:${nextPort}`,
    changeOrigin: true,
    ws: true,
    onError: (err, req, res) => {
        res.status(502).send(`
            <div style="font-family: sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: #3b82f6;">Next.js is Starting...</h1>
                <p>The Application server is booting up. Next.js SSR engine takes a few seconds to warm up.</p>
                <p><strong>Please refresh the page in 5-10 seconds.</strong></p>
                <code style="color: #ef4444; margin-top: 20px; display: block;">Error: ${err.message}</code>
            </div>
        `);
    }
}));


// Global Error Handler (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Security features: Rate limiting, Input sanitization, Security headers enabled`);
});
