const pool = require('../db');
const fs = require('fs');
const path = require('path');

/**
 * SEO Database Migration
 * Adds all required fields for enterprise SEO system
 */
async function migrateSEOFields() {
    const connection = await pool.getConnection();

    try {
        console.log('🔄 Starting SEO Field Migration...');

        // Add SEO columns to content table
        const columns = [
            {
                name: 'primary_keyword',
                definition: 'VARCHAR(255) DEFAULT NULL',
                description: 'Main target keyword for this page'
            },
            {
                name: 'target_keywords',
                definition: 'JSON DEFAULT NULL',
                description: 'Array of secondary target keywords'
            },
            {
                name: 'internal_links',
                definition: 'JSON DEFAULT NULL',
                description: 'Auto-generated related internal links'
            },
            {
                name: 'canonical_url',
                definition: 'VARCHAR(500) DEFAULT NULL',
                description: 'Canonical URL for this content'
            },
            {
                name: 'unit_number',
                definition: 'INT DEFAULT NULL',
                description: 'Unit/chapter number for ordering'
            },
            {
                name: 'content_word_count',
                definition: 'INT DEFAULT 0',
                description: 'Word count of blog_content (for SEO monitoring)'
            },
            {
                name: 'year_slug',
                definition: 'VARCHAR(100) DEFAULT NULL',
                description: 'Year slug (1st-year, 2nd-year, etc.)'
            },
            {
                name: 'breadcrumb_path',
                definition: 'JSON DEFAULT NULL',
                description: 'Breadcrumb trail for this page'
            },
            {
                name: 'is_indexable',
                definition: 'BOOLEAN DEFAULT TRUE',
                description: 'Whether page should be indexed by search engines'
            },
            {
                name: 'priority',
                definition: 'DECIMAL(2,1) DEFAULT 0.8',
                description: 'Sitemap priority (0.0 to 1.0)'
            },
            {
                name: 'changefreq',
                definition: "ENUM('always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never') DEFAULT 'monthly'",
                description: 'Sitemap change frequency'
            },
            {
                name: 'last_seo_update',
                definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
                description: 'Last time SEO fields were updated'
            },
            {
                name: 'reading_time_minutes',
                definition: 'INT DEFAULT NULL',
                description: 'Estimated reading time (good for UX + schema)'
            }
        ];

        for (const col of columns) {
            try {
                await connection.query(
                    `ALTER TABLE content ADD COLUMN ${col.name} ${col.definition} COMMENT '${col.description}'`
                );
                console.log(`✅ Added column: ${col.name}`);
            } catch (error) {
                if (error.code === 'ER_DUP_FIELDNAME') {
                    console.log(`⏭️  Column already exists: ${col.name}`);
                } else {
                    console.error(`❌ Error adding ${col.name}:`, error.message);
                }
            }
        }

        // Add indexes for performance
        const indexes = [
            { name: 'idx_primary_keyword', column: 'primary_keyword' },
            { name: 'idx_canonical_url', column: 'canonical_url' },
            { name: 'idx_year_slug', column: 'year_slug' },
            { name: 'idx_unit_number', column: 'unit_number' },
            { name: 'idx_is_indexable', column: 'is_indexable' }
        ];

        for (const idx of indexes) {
            try {
                await connection.query(
                    `ALTER TABLE content ADD INDEX ${idx.name} (${idx.column})`
                );
                console.log(`✅ Added index: ${idx.name}`);
            } catch (error) {
                if (error.code === 'ER_DUP_KEYNAME') {
                    console.log(`⏭️  Index already exists: ${idx.name}`);
                } else {
                    console.error(`❌ Error adding ${idx.name}:`, error.message);
                }
            }
        }

        // Create keyword_mapping table for centralized keyword management
        try {
            await connection.query(`
                CREATE TABLE IF NOT EXISTS keyword_mappings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    keyword VARCHAR(255) NOT NULL UNIQUE,
                    url VARCHAR(500) NOT NULL,
                    content_id INT,
                    search_volume INT DEFAULT 0,
                    difficulty INT DEFAULT 0,
                    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
                    INDEX idx_keyword (keyword),
                    INDEX idx_url (url)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Keyword to URL mapping for anti-cannibalization'
            `);
            console.log('✅ Created keyword_mappings table');
        } catch (error) {
            if (error.code === 'ER_TABLE_EXISTS_ERROR') {
                console.log('⏭️  keyword_mappings table already exists');
            } else {
                throw error;
            }
        }

        // Create sitemap_cache table for performance
        try {
            await connection.query(`
                CREATE TABLE IF NOT EXISTS sitemap_cache (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    sitemap_type ENUM('core', 'content', 'index') NOT NULL,
                    xml_content LONGTEXT NOT NULL,
                    last_generated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    urls_count INT DEFAULT 0,
                    UNIQUE KEY unique_type (sitemap_type)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Cached sitemap XML for performance'
            `);
            console.log('✅ Created sitemap_cache table');
        } catch (error) {
            if (error.code === 'ER_TABLE_EXISTS_ERROR') {
                console.log('⏭️  sitemap_cache table already exists');
            } else {
                throw error;
            }
        }

        console.log('\n✅ SEO Migration Complete!\n');

        // Write migration log
        const logPath = path.join(__dirname, 'migration.log');
        const logMessage = `[${new Date().toISOString()}] SEO fields migration completed successfully\n`;
        fs.appendFileSync(logPath, logMessage);

        connection.release();
        return { success: true, message: 'Migration completed successfully' };

    } catch (error) {
        connection.release();
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

// Run migration if called directly
if (require.main === module) {
    migrateSEOFields()
        .then(() => {
            console.log('Migration script finished');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration failed:', error);
            process.exit(1);
        });
}

module.exports = migrateSEOFields;
