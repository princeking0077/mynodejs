require('dotenv').config({ path: './hostinger.env' }); // Use hostinger DB creds
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

        // Add meta_title
        try {
            await connection.query("ALTER TABLE content ADD COLUMN meta_title VARCHAR(255) DEFAULT NULL AFTER title");
            console.log("Added column: meta_title");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("Column meta_title already exists.");
            } else {
                console.error("Error adding meta_title:", e.message);
            }
        }

        // Add meta_description
        try {
            await connection.query("ALTER TABLE content ADD COLUMN meta_description TEXT DEFAULT NULL AFTER meta_title");
            console.log("Added column: meta_description");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("Column meta_description already exists.");
            } else {
                console.error("Error adding meta_description:", e.message);
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
