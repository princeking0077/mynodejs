-- Run this in Hostinger phpMyAdmin to check if migration ran

-- 1. Check if new columns exist in content table
DESCRIBE content;

-- Expected output should include these columns:
-- primary_keyword (varchar)
-- target_keywords (json)
-- canonical_url (varchar)
-- breadcrumb_path (json)  
-- internal_links (json)
-- content_word_count (int)
-- reading_time_minutes (int)
-- year_slug (varchar)
-- unit_number (int)
-- is_indexable (tinyint)
-- priority (decimal)
-- changefreq (varchar)
-- last_seo_update (timestamp)

-- 2. Check if keyword_mappings table exists
SHOW TABLES LIKE 'keyword_mappings';

-- 3. Check if sitemap_cache table exists  
SHOW TABLES LIKE 'sitemap_cache';

-- 4. If tables/columns exist, check if data is populated
SELECT id, title, canonical_url, breadcrumb_path, primary_keyword 
FROM content 
LIMIT 5;

-- If columns don't exist → You need to run the migration!
-- If columns exist but data is NULL → Re-save content from admin
