const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcrypt');

async function setup() {
    console.log("Starting Database Setup...");

    // Connect without database first to create it
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        console.log(`Database '${process.env.DB_NAME}' checked/created.`);

        await connection.end();

        // Connect to database
        const db = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        // 1. Users Table (minimal fields needed by auth)
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Users table ready.");

        // 2. Settings Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(100) UNIQUE,
                setting_value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log("Settings table ready.");

        // 3. Content Table (matches API usage)
        await db.query(`
            CREATE TABLE IF NOT EXISTS content (
                id INT AUTO_INCREMENT PRIMARY KEY,
                subject_id VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                description LONGTEXT,
                blog_content LONGTEXT,
                youtube_id VARCHAR(50),
                file_url VARCHAR(500),
                quiz_data JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        try {
            await db.query("CREATE INDEX idx_content_subject_slug ON content(subject_id, slug)");
        } catch (e) {
            if (e.code !== 'ER_DUP_KEYNAME') {
                console.error("Index creation failed:", e.message);
            }
        }
        console.log("Content table ready.");

        // Optional: migrate legacy 'topics' table into 'content' once
        const [[{ table_count }]] = await db.query("SELECT COUNT(*) AS table_count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'topics'", [process.env.DB_NAME]);
        const [[{ content_rows }]] = await db.query("SELECT COUNT(*) AS content_rows FROM content");

        if (table_count > 0 && content_rows === 0) {
            console.log("Found legacy 'topics' table. Copying rows into 'content'...");
            const [topics] = await db.query("SELECT subject_id, title, description, blog_content, youtube_id, file_url, quiz_data, created_at FROM topics");

            const generateSlug = (text) => text.toString().toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');

            for (const row of topics) {
                let slug = generateSlug(row.title || "");
                if (!slug) slug = `item-${Date.now()}`;

                // Ensure slug uniqueness on import
                const [existing] = await db.query("SELECT id FROM content WHERE slug = ?", [slug]);
                if (existing.length > 0) {
                    slug = `${slug}-${Date.now()}`;
                }

                await db.query(
                    "INSERT INTO content (subject_id, title, slug, description, blog_content, youtube_id, file_url, quiz_data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [row.subject_id, row.title, slug, row.description, row.blog_content, row.youtube_id, row.file_url, row.quiz_data, row.created_at]
                );
            }
            console.log(`Migrated ${topics.length} rows from 'topics' to 'content'.`);
        }

        // Create Default Admin User
        const [rows] = await db.query("SELECT * FROM users WHERE email = 'admin@apexapps.in'");
        if (rows.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await db.query("INSERT INTO users (email, password) VALUES (?, ?)", ['admin@apexapps.in', hashedPassword]);
            console.log("Default Admin User Created (admin@apexapps.in / admin123)");
        } else {
            console.log("Admin user already exists.");
        }

        console.log("✅ Setup Complete!");
        process.exit();

    } catch (error) {
        console.error("Setup Failed:", error);
        process.exit(1);
    }
}

setup();
