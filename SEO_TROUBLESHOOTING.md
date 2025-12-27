# SEO Troubleshooting - Why Breadcrumbs Aren't Showing

## Current Status: SEO Not Displaying

**User reports:** Saved content with SEO fields, but breadcrumbs/SEO data not visible on frontend

## Possible Root Causes:

### 1. ❌ Database Migration Didn't Run on Hostinger
**Most Likely Issue**

The auto-migration code in `server/index.js` might have:
- Failed silently
- Not executed due to error
- Been skipped due to lock file created locally

**Check:**
```bash
# SSH into Hostinger
ls -la server/migrations/
```

Look for `.seo-migration-completed` file. If it doesn't exist, migration never ran.

**Fix:**
```bash
# SSH into Hostinger  
cd /path/to/your/app
node server/migrations/add-seo-fields.js
```

### 2. Database Columns Don't Exist

**Verify:**
```sql
-- In Hostinger phpMyAdmin
DESCRIBE content;
```

Should see these columns:
- `primary_keyword`
- `target_keywords`
- `canonical_url`
- `breadcrumb_path`
- `internal_links`
- `content_word_count`
- `reading_time_minutes`
- `year_slug`
- `unit_number`

If columns are MISSING → Migration didn't run

### 3. API Not Returning New Fields

**Test:**
Visit: `https://learnpharmacy.in/api/content?subject={SUBJECT_ID}`

Check JSON response for:
```json
{
  "canonical_url": "...",
  "breadcrumb_path": "[...]",
  "primary_keyword": "..."
}
```

If NULL or missing → Content wasn't re-saved OR columns don't exist

### 4. Frontend Not Rebuilt

**Already ruled out** - You're on commit e47d867 which includes SubjectView changes

---

## Recommended Fix (Do in Order):

### Step 1: Verify Migration Ran
```bash
# SSH to Hostinger
mysql -u DB_USER -p DB_NAME
DESCRIBE content;
exit
```

### Step 2: If Columns Don't Exist, Run Migration
```bash
node server/migrations/add-seo-fields.js
```

### Step 3: Re-save Content
- Admin Dashboard
- Edit "Introduction to Pharmacology"
- Fill ALL SEO fields
- Save

### Step 4: Hard Refresh Page
- CTRL + SHIFT + R (Windows)
- CMD + SHIFT + R (Mac)

---

## What to Look For After Fix:

✅ **Breadcrumbs visible** at top of page  
✅ **View Page Source** shows `<link rel="canonical" .../>`  
✅ **Meta keywords** in `<head>`  
✅ **Internal links** at bottom of content

---

## If Still Not Working:

**Check Browser Console Network Tab:**
1. Open Dev Tools (F12)
2. Go to Network tab
3. Reload page
4. Click the API request to `/api/content?subject=...`
5. Look at **Response** tab
6. Verify SEO fields are in JSON

If fields are NULL in JSON → Content needs to be re-saved

**Most likely you need to SSH into Hostinger and manually run the migration!**
