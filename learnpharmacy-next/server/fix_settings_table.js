require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
    const c = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    // Drop and recreate with correct schema
    await c.query('DROP TABLE IF EXISTS settings');
    await c.query(`CREATE TABLE settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);
    console.log('settings table recreated OK');

    await c.end();
    process.exit(0);
})().catch(e => { console.error('Failed:', e.message); process.exit(1); });
