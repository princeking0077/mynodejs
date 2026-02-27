const express = require('express');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const pool = require('./db');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 1. API Routes (Keep your existing Express Database Routes functional)
try {
    app.use('/api/auth', require('./routes/auth.routes'));
    app.use('/api/content', require('./routes/content.routes'));
    app.use('/api/upload', require('./routes/upload.routes'));
    app.use('/api/settings', require('./routes/settings.routes'));
    app.use('/api/seo', require('./routes/seo.routes'));
} catch (e) {
    console.error("Warning: API routes not found. Only proxying will work.");
}

// 2. Health Check
app.get('/api/health', (req, res) => res.json({ message: "Express Proxy Server Running" }));

// ==========================================
// 3. NEXT.JS REVERSE PROXY FIX
// ==========================================
// Proxy ALL other traffic to Next.js running on Port 3000
app.use('*', (req, res, next) => {
    // Safety check to ensure /api routes don't get trapped if missing
    if (req.path.startsWith('/api/')) return next();

    // Reverse Proxy to Next.js app
    createProxyMiddleware({
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        ws: true,
        onError: (err, req, res) => {
            res.status(502).send(`
                <div style="text-align: center; padding: 50px; font-family: sans-serif;">
                    <h1>Next.js Server Not Running</h1>
                    <p>The Express proxy is working, but Next.js is not answering on Port 3000.</p>
                    <code>Error: ${err.message}</code>
                </div>
            `);
        }
    })(req, res, next);
});
// ==========================================

const PORT = process.env.PORT || 8080; // Hostinger usually uses dynamic ports
app.listen(PORT, () => {
    console.log(`Express Proxy Server running on port ${PORT}`);
});
