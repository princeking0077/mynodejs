const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// IMPORTANT: We load Next.js directly from the subfolder you uploaded.
const next = require(path.join(__dirname, '../learnpharmacy-next/node_modules/next'));

const dev = process.env.NODE_ENV !== 'production';

// Initialize Next.js engine
// dir MUST point to the learnpharmacy-next folder
const nextApp = next({ dev, dir: path.join(__dirname, '../learnpharmacy-next') });
const handle = nextApp.getRequestHandler();

console.log("----- STARTING COMBINED EXPRESS + NEXT.JS SERVER -----");
console.log(`Port: ${process.env.PORT || 'Default'}`);

nextApp.prepare().then(() => {
    const app = express();
    const helmet = require('helmet');
    const compression = require('compression');
    const morgan = require('morgan');
    const pool = require('./db');
    require('dotenv').config({ path: path.join(__dirname, '.env') });

    // Middleware
    app.use(helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: false,
        xRobotsTag: false
    }));
    app.use(compression());
    app.use(morgan('combined'));
    app.use(cors());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Serve Uploads
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    app.use('/uploads', express.static(uploadDir));

    // API Routes (Directly handled by Express)
    try {
        app.use('/api/auth', require('./routes/auth.routes'));
        app.use('/api/content', require('./routes/content.routes'));
        app.use('/api/upload', require('./routes/upload.routes'));
        app.use('/api/settings', require('./routes/settings.routes'));
        app.use('/api/seo', require('./routes/seo.routes'));
    } catch (e) {
        console.error("Warning: API routes not found. Only Next.js will work.");
    }

    // Health & Debug
    app.get('/api/health', (req, res) => res.json({ message: "Pharma Combined Server Running" }));

    app.get('/api/debug-status', async (req, res) => {
        try {
            const [rows] = await pool.query("SELECT count(*) as count FROM users");
            const [content] = await pool.query("SELECT count(*) as count FROM content");
            res.json({ status: "OK", db: process.env.DB_NAME, users: rows[0].count, content: content[0].count });
        } catch (e) {
            res.status(500).json({ status: "ERROR", error: e.message });
        }
    });

    app.get('/reset-admin', async (req, res) => {
        try {
            const bcrypt = require('bcryptjs');
            const connection = await pool.getConnection();

            const email = 'shoaib.ss300@gmail.com';
            const rawPassword = 'Shaikh@#$001';
            const hashedPassword = await bcrypt.hash(rawPassword, 10);

            const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
            let message = '';
            if (rows.length > 0) {
                await connection.execute('UPDATE users SET password = ?, role = ? WHERE email = ?', [hashedPassword, 'admin', email]);
                message = 'Admin Password UPDATED successfully.';
            } else {
                await connection.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Shoaib Shaikh', email, hashedPassword, 'admin']);
                message = 'Admin User CREATED successfully.';
            }

            connection.release();
            res.status(200).json({ status: 'success', message: message, credentials: { email, password: rawPassword } });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    });

    // ==========================================
    // 3. NEXT.JS CATCH-ALL FRONTEND
    // Any route that isn't /api/* gets perfectly handled natively by Next.js!
    // ==========================================
    app.all('*', (req, res) => {
        return handle(req, res);
    });

    // Global Error Handler
    app.use((err, req, res, next) => {
        console.error("Global Error:", err);
        if (res.headersSent) return next(err);

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
        console.log(`Server listening natively on Hostinger port ${PORT}`);
    });
}).catch((ex) => {
    console.error("Next.js App failed to boot", ex.stack);
    process.exit(1);
});
