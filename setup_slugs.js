const pool = require('./db');
const fs = require('fs');

const runMigration = async () => {
    try {
        console.log("Starting Migration...");

        // Prefer 'content' table; fall back to legacy 'topics' if needed
        const [[{ content_table }]] = await pool.query("SELECT COUNT(*) AS content_table FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'content'");
        const targetTable = content_table > 0 ? 'content' : 'topics';

        // 1. Add 'slug' column to target table if not exists
        try {
            await pool.query(`ALTER TABLE ${targetTable} ADD COLUMN slug VARCHAR(255) UNIQUE`);
            console.log(`Added 'slug' column to ${targetTable}.`);
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log(`'slug' column already exists on ${targetTable}.`);
            } else {
                console.error("Error adding slug column:", e);
            }
        }

        // 2. Add AdSense fields to settings if not exists
        const settingsFields = [
            "ADD COLUMN adsense_code TEXT",
            "ADD COLUMN ads_txt TEXT",
            "ADD COLUMN ad_rpm_head VARCHAR(255)",
            "ADD COLUMN ad_rpm_body VARCHAR(255)"
        ];

        for (const field of settingsFields) {
            try {
                await pool.query(`ALTER TABLE settings ${field}`);
                console.log(`Executed: ALTER TABLE settings ${field}`);
            } catch (e) {
                if (e.code === 'ER_DUP_FIELDNAME') {
                    // ignore
                } else {
                    console.error("Error altering settings:", e);
                }
            }
        }

        // 3. Backfill Slugs
        console.log(`Backfilling slugs on ${targetTable}...`);
        const [topics] = await pool.query(`SELECT id, title, slug FROM ${targetTable}`);

        for (const topic of topics) {
            if (!topic.slug) {
                const slug = topic.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
                    .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens

                // Ensure uniqueness (simple append id if needed, though rare for backfill)
                await pool.query(`UPDATE ${targetTable} SET slug = ? WHERE id = ?`, [slug, topic.id]);
                console.log(`Generated slug '${slug}' for record '${topic.title}' in ${targetTable}`);
            }
        }

        console.log("Migration Complete!");
        process.exit(0);

    } catch (e) {
        console.error("Migration Failed:", e);
        process.exit(1);
    }
};

runMigration();
