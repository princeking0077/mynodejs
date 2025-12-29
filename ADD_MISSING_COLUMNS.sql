-- Add missing SEO and Content columns to 'content' table
-- Run this in phpMyAdmin if these columns are missing

ALTER TABLE content
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS faqs JSON DEFAULT NULL,
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS year_slug VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS unit_number INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS primary_keyword VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS target_keywords JSON DEFAULT NULL,
ADD COLUMN IF NOT EXISTS canonical_url VARCHAR(500) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS breadcrumb_path JSON DEFAULT NULL,
ADD COLUMN IF NOT EXISTS content_word_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS reading_time_minutes INT DEFAULT 0;

-- Add indexes for performance (Skip if they already exist)
CREATE INDEX idx_slug ON content(slug);
CREATE INDEX idx_year_unit ON content(year_slug, unit_number);
CREATE INDEX idx_primary_keyword ON content(primary_keyword);
