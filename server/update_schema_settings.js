require('dotenv').config({ path: './hostinger.env' });
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pharmacy_db'
};

const updateSchema = async () => {
    let connection;
    try {
        console.log("Connecting to database...");
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected.");

        // 1. Create Settings Table
        const createSettingsTable = `
            CREATE TABLE IF NOT EXISTS settings (
                setting_key VARCHAR(50) PRIMARY KEY,
                setting_value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        await connection.query(createSettingsTable);
        console.log("Ensured 'settings' table exists.");

        // 2. Add 'faqs' column to 'content' table (JSON)
        try {
            await connection.query("ALTER TABLE content ADD COLUMN faqs JSON DEFAULT NULL AFTER quiz_data");
            console.log("Added column: faqs");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("Column 'faqs' already exists.");
            } else {
                console.error("Error adding 'faqs':", e.message);
            }
        }

        console.log("Schema update complete.");

    } catch (error) {
        console.error("Schema update failed:", error);
    } finally {
        if (connection) await connection.end();
    }
};

updateSchema();
