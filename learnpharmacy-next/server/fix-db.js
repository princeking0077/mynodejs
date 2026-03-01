require('dotenv').config({ path: '/home/learnpharmacy/htdocs/www.learnpharmacy.in/learnpharmacy-next/.env' });
const mysql = require('mysql2/promise');

async function run() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        await db.query(`
            CREATE TABLE IF NOT EXISTS global_seo_settings (
                setting_key VARCHAR(100) PRIMARY KEY,
                setting_value TEXT,
                description VARCHAR(255) NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Fixed DB Table for Settings!');
        await db.end();
    } catch (e) {
        console.error("DB Error:", e);
    }
}

run();
