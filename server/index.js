const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Allow inline scripts for React/Images
}));
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/content', require('./routes/content.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
// app.use('/', require('./routes/ads.routes')); 

// Health & Debug
app.get('/api/health', (req, res) => res.json({ message: "Pharma Server Running" }));
app.get('/api/ping', (req, res) => res.send("PONG - Production Server Alive (v2.0 - 200MB Limit)"));

app.get('/api/debug-status', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT count(*) as count FROM users");
        res.json({ status: "OK", db: process.env.DB_NAME, users: rows[0].count });
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
        await connection.query("ALTER TABLE content MODIFY COLUMN blog_content LONGTEXT");
        console.log("✅ SCHEMA AUTO-FIX: blog_content upgraded to LONGTEXT");
        connection.release();
    } catch (e) {
        // If error is not "duplicate", log it. But usually safe to ignore if it fails (e.g. conn error)
        console.log("ℹ️ Schema Fix Attempted:", e.message);
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

// Serve React Frontend (FINAL CATCH-ALL)
// Serve React Frontend (Vite Build)
// Check multiple possible locations for robustness
const possiblePaths = [
    path.join(__dirname, '../client/dist'), // Standard Structure
    path.join(__dirname, '../client/build'), // React Standard
    path.join(__dirname, 'client/dist'),    // If running from server root
    path.join(process.cwd(), 'client/dist'), // From project root
    path.join(process.cwd(), 'dist')         // Fallback
];

let buildPath = null;
for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
        buildPath = p;
        break;
    }
}

if (buildPath) {
    console.log(`Serving Frontend from: ${buildPath}`);
    app.use(express.static(buildPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
} else {
    // For development (or if build is missing), just log
    // List contents of directories to help debug
    const listDir = (dir) => {
        try {
            return fs.readdirSync(dir).join(', ');
        } catch (e) {
            return `[Error reading: ${e.message}]`;
        }
    };

    console.log("Client build not found. Checked: " + possiblePaths.join(", "));
    app.get('/', (req, res) => res.send(`
        <div style="font-family: monospace; padding: 20px;">
            <h1 style="color: red;">Backend Running - Frontend Not Found</h1>
            <p><strong>Checked Paths:</strong></p>
            <ul>${possiblePaths.map(p => `<li>${p}</li>`).join('')}</ul>
            
            <hr>
            <h3>Server Diagnostics:</h3>
            <p><strong>Current Directory (__dirname):</strong> ${__dirname}</p>
            <p><strong>Files:</strong> ${listDir(__dirname)}</p>
            
            <p><strong>Process CWD:</strong> ${process.cwd()}</p>
            <p><strong>Files:</strong> ${listDir(process.cwd())}</p>
            
            <p><strong>Parent Directory (../):</strong> ${path.resolve(__dirname, '..')}</p>
            <p><strong>Files:</strong> ${listDir(path.resolve(__dirname, '..'))}</p>
            
            <p><strong>Client Directory Check (../client):</strong> ${path.resolve(__dirname, '../client')}</p>
            <p><strong>Files:</strong> ${listDir(path.resolve(__dirname, '../client'))}</p>
             <p><strong>Dist Directory Check (../client/dist):</strong> ${path.resolve(__dirname, '../client/dist')}</p>
            <p><strong>Files:</strong> ${listDir(path.resolve(__dirname, '../client/dist'))}</p>
        </div>
    `));
}

// Global Error Handler (Must be last)
app.use((err, req, res, next) => {
    console.error("Global Error:", err);
    if (res.headersSent) return next(err);

    // Handle Body Parser 413
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ message: "File/Content too large (Max 50MB)" });
    }

    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
