const mysql = require('mysql2/promise');
const path = require('path');
// Redundant check: Try loading from server root AND project root
require('dotenv').config({ path: path.join(__dirname, '.env') });
if (!process.env.DB_HOST) require('dotenv').config({ path: path.join(__dirname, '../.env') });

if (!process.env.DB_USER) {
    console.error("CRITICAL ERROR: DB_USER is missing from environment variables!");
    console.error("Current ENV keys:", Object.keys(process.env));
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1', // Force IPv4 to avoid ::1 access denied errors
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Connection Only in Runtime (not during build)
// Skip DB connection during Next.js build, export, or test phases
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
                    process.env.NEXT_PHASE === 'phase-export' ||
                    process.env.NODE_ENV === 'test';

if (!isBuildTime && process.env.DB_USER) {
    pool.getConnection()
        .then(connection => {
            console.log('DATABASE CONNECTED SUCCESSFULLY');
            connection.release();
        })
        .catch(err => {
            console.error('DATABASE CONNECTION FAILED:', err.message);
            console.error('Check your DB_HOST, DB_USER, DB_PASS in environment variables.');
        });
}

module.exports = pool;
