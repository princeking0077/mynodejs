-- ============================================
-- SEO MIGRATION FOR LEARNPHARMACY.IN
-- Run this in Hostinger phpMyAdmin
-- ============================================

-- Step 1: Add new SEO columns to content table
ALTER TABLE content
ADD COLUMN IF NOT EXISTS primary_keyword VARCHAR(255) DEFAULT NULL COMMENT 'Main target keyword for this content',
ADD COLUMN IF NOT EXISTS target_keywords JSON DEFAULT NULL COMMENT 'Array of secondary keywords',
ADD COLUMN IF NOT EXISTS internal_links JSON DEFAULT NULL COMMENT 'Auto-generated internal linking structure',
ADD COLUMN IF NOT EXISTS canonical_url VARCHAR(500) DEFAULT NULL COMMENT 'SEO canonical URL',
ADD COLUMN IF NOT EXISTS unit_number INT DEFAULT NULL COMMENT 'Unit/Day number for sequencing',
ADD COLUMN IF NOT EXISTS content_word_count INT DEFAULT 0 COMMENT 'Auto-calculated word count',
ADD COLUMN IF NOT EXISTS year_slug VARCHAR(50) DEFAULT NULL COMMENT 'Year identifier (1st-year, 2nd-year, gpat)',
ADD COLUMN IF NOT EXISTS breadcrumb_path JSON DEFAULT NULL COMMENT 'Breadcrumb navigation trail',
ADD COLUMN IF NOT EXISTS is_indexable TINYINT(1) DEFAULT 1 COMMENT 'Allow search engine indexing',
ADD COLUMN IF NOT EXISTS priority DECIMAL(2,1) DEFAULT 0.5 COMMENT 'Sitemap priority (0.0-1.0)',
ADD COLUMN IF NOT EXISTS changefreq VARCHAR(20) DEFAULT 'weekly' COMMENT 'Sitemap change frequency',
ADD COLUMN IF NOT EXISTS last_seo_update TIMESTAMP NULL DEFAULT NULL COMMENT 'Last SEO modification time',
ADD COLUMN IF NOT EXISTS reading_time_minutes INT DEFAULT 0 COMMENT 'Estimated reading time';

-- Step 2: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_primary_keyword ON content(primary_keyword);
CREATE INDEX IF NOT EXISTS idx_year_slug ON content(year_slug);
CREATE INDEX IF NOT EXISTS idx_unit_number ON content(unit_number);
CREATE INDEX IF NOT EXISTS idx_is_indexable ON content(is_indexable);
CREATE INDEX IF NOT EXISTS idx_canonical_url ON content(canonical_url);

-- Step 3: Create keyword_mappings table (anti-cannibalization)
CREATE TABLE IF NOT EXISTS keyword_mappings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL UNIQUE COMMENT 'The keyword being tracked',
    content_id INT NOT NULL COMMENT 'Which content owns this keyword',
    url VARCHAR(500) NOT NULL COMMENT 'Canonical URL of the content',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    INDEX idx_keyword (keyword),
    INDEX idx_content_id (content_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tracks keyword usage to prevent cannibalization';

-- Step 4: Create sitemap_cache table (performance optimization)
CREATE TABLE IF NOT EXISTS sitemap_cache (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sitemap_type VARCHAR(50) NOT NULL COMMENT 'Type: index, core, content',
    xml_content LONGTEXT NOT NULL COMMENT 'Generated XML sitemap',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_sitemap_type (sitemap_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cached sitemaps for performance';

-- Step 5: Verify migration success
SELECT 'Migration completed successfully!' AS status;
SELECT COUNT(*) AS new_columns_added FROM information_schema.COLUMNS 
WHERE TABLE_NAME = 'content' AND COLUMN_NAME IN (
    'primary_keyword', 'target_keywords', 'canonical_url', 'breadcrumb_path',
    'internal_links', 'year_slug', 'unit_number', 'content_word_count',
    'reading_time_minutes', 'is_indexable', 'priority', 'changefreq', 'last_seo_update'
);

-- ============================================
-- INSTRUCTIONS:
-- 1. Log into Hostinger
-- 2. Go to phpMyAdmin
-- 3. Select your database
-- 4. Click "SQL" tab at the top
-- 5. Paste this entire file
-- 6. Click "Go" button
-- 7. You should see "Migration completed successfully!"
-- 8. Then go back to admin and re-save your content
-- ============================================
