require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
    const c = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    await c.query(`CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);
    console.log('settings table OK');

    await c.query(`CREATE TABLE IF NOT EXISTS global_seo_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        site_title VARCHAR(255) DEFAULT 'LearnPharmacy.in',
        meta_description TEXT,
        google_tag VARCHAR(100),
        og_image VARCHAR(500),
        footer_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);
    console.log('global_seo_settings table OK');

    await c.query(`CREATE TABLE IF NOT EXISTS internal_links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content_id INT,
        link_text VARCHAR(255),
        link_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log('internal_links table OK');

    await c.query(`CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content LONGTEXT,
        meta_title VARCHAR(255),
        meta_description TEXT,
        category VARCHAR(100),
        author VARCHAR(100),
        published TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);
    console.log('articles table OK');

    // Seed one default global_seo_settings row if empty
    const [rows] = await c.query('SELECT COUNT(*) as cnt FROM global_seo_settings');
    if (rows[0].cnt === 0) {
        await c.query(`INSERT INTO global_seo_settings (site_title, meta_description)
            VALUES ('LearnPharmacy.in | Visual Pharmacy Education', 
            'India\\'s best B.Pharm and GPAT study platform with visual notes, 3D animations and quizzes.')`);
        console.log('Inserted default SEO settings');
    }

    console.log('All tables ready!');
    await c.end();
    process.exit(0);
})().catch(e => { console.error('Failed:', e.message); process.exit(1); });
