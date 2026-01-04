const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

console.log("----- SERVER STARTING -----");
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${process.env.PORT}`);

// Global Error Handlers to prevent silent crashes
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
    // Keep running if possible, or exit with 1
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
});

// Create uploads directory if not exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const app = express();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow serving images/files
}));
app.use(compression()); // Compress responses
app.use(morgan('combined')); // Logging
app.use(cors()); // Configure specific origins in production if needed
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads Static Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (Importing later)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/content', require('./routes/content.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/', require('./routes/ads.routes')); // Serve /ads.txt at root level

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ message: "Pharma Server Running" });
});

// Serve React Frontend (Production)
// Prefer repo-committed Vite `client/dist` when available; fall back to `client_build`.
const possiblePaths = [
    path.join(__dirname, '../client/dist'),
    path.join(process.cwd(), 'client/dist'),
    path.join(process.cwd(), 'dist'),
    path.join(__dirname, 'client_build')
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
        // Prevent stale index.html from being cached; hashed assets remain safe to cache.
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.sendFile(path.join(buildPath, 'index.html'));
    });
} else {
    console.error('Client build not found. Checked: ' + possiblePaths.join(', '));
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
