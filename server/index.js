const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/content', require('./routes/content.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
// app.use('/', require('./routes/ads.routes')); 

// Health & Debug
app.get('/api/health', (req, res) => res.json({ message: "Pharma Server Running" }));
app.get('/api/ping', (req, res) => res.send("PONG - Production Server Alive"));

app.get('/api/debug-status', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT count(*) as count FROM users");
        res.json({ status: "OK", db: process.env.DB_NAME, users: rows[0].count });
    } catch (e) {
        res.status(500).json({ status: "ERROR", error: e.message });
    }
});

// Serve React Frontend (FINAL CATCH-ALL)
// Serve React Frontend (Vite Build)
const buildPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
} else {
    // For development (or if build is missing), just log
    console.log("Client build not found at " + buildPath + ". Assuming local dev or separate deployment.");
    app.get('/', (req, res) => res.send(`Backend Running. Frontend not found.<br>Checked Path: <strong>${buildPath}</strong><br><br>Please run <code>npm run build</code> in the root directory.`));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
