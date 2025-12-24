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
    host: '127.0.0.1', // Force IPv4 to avoid ::1 access denied errors
    user: 'u480091743_shoaib',
    password: 'Shaikh@001001',
    database: 'u480091743_pharmacy',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Connection Immediately
pool.getConnection()
    .then(connection => {
        console.log('DATABASE CONNECTED SUCCESSFULLY');
        connection.release();
    })
    .catch(err => {
        console.error('DATABASE CONNECTION FAILED:', err.message);
        console.error('Check your DB_HOST, DB_USER, DB_PASS in environment variables.');
    });

module.exports = pool;
