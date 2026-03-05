const pool = require('../db');

/**
 * Creates global_seo_settings table for storing site-wide configuration
 */
async function createGlobalSettingsTable() {
    const connection = await pool.getConnection();

    try {
        console.log('🔄 Creating global_seo_settings table...');

        // Create the table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS global_seo_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(100) NOT NULL UNIQUE,
                setting_value TEXT,
                description VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_setting_key (setting_key)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Global site settings for SEO, analytics, and configuration'
        `);

        console.log('✅ global_seo_settings table created');

        // Insert default values
        const defaultSettings = [
            { key: 'siteTitle', value: 'LearnPharmacy.in | Visual Pharmacy Education', description: 'Site title for meta tags' },
            { key: 'metaDescription', value: "India's best B.Pharm notes platform with visual learning", description: 'Default meta description' },
            { key: 'ogImage', value: 'https://www.learnpharmacy.in/og-image.jpg', description: 'Default Open Graph image' },
            { key: 'google_analytics_id', value: '', description: 'Google Analytics tracking ID' },
            { key: 'google_search_console', value: '', description: 'Google Search Console verification meta tag' },
            { key: 'adsense_code', value: '', description: 'Google AdSense script tag' }
        ];

        for (const setting of defaultSettings) {
            try {
                await connection.query(
                    `INSERT INTO global_seo_settings (setting_key, setting_value, description)
                     VALUES (?, ?, ?)
                     ON DUPLICATE KEY UPDATE description = ?`,
                    [setting.key, setting.value, setting.description, setting.description]
                );
                console.log(`✅ Added default setting: ${setting.key}`);
            } catch (error) {
                console.log(`⏭️  Setting already exists: ${setting.key}`);
            }
        }

        console.log('✅ Global settings table migration complete!\n');

        connection.release();
        return { success: true, message: 'Global settings table created successfully' };

    } catch (error) {
        connection.release();
        console.error('❌ Global settings migration failed:', error);
        throw error;
    }
}

// Run migration if called directly
if (require.main === module) {
    createGlobalSettingsTable()
        .then(() => {
            console.log('Migration script finished');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration failed:', error);
            process.exit(1);
        });
}

module.exports = createGlobalSettingsTable;
