const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const upgrade = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'pharmacy_db'
        });

        console.log('Connected to database. Upgrading blog_content to LONGTEXT...');

        await connection.execute("ALTER TABLE content MODIFY COLUMN blog_content LONGTEXT");

        console.log('SUCCESS: blog_content is now LONGTEXT.');
        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('Upgrade failed:', error);
        process.exit(1);
    }
};

upgrade();
