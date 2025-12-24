const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'pharmacy_db'
        });

        console.log("Connected. Adding missing SEO columns...");

        const addCol = async (colDef) => {
            try {
                await connection.query(`ALTER TABLE content ADD COLUMN ${colDef}`);
                console.log(`✅ Added: ${colDef}`);
            } catch (e) {
                if (e.code === 'ER_DUP_FIELDNAME') {
                    console.log(`ℹ️ Exists: ${colDef.split(' ')[0]}`);
                } else {
                    console.error(`❌ Error adding ${colDef}:`, e.message);
                }
            }
        };

        await addCol("meta_title VARCHAR(255)");
        await addCol("meta_description TEXT");
        await addCol("faqs JSON");

        console.log("Migration Complete.");
        await connection.end();
        process.exit(0);

    } catch (e) {
        console.error("Migration Failed:", e);
        process.exit(1);
    }
})();
