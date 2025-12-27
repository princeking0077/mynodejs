# URGENT: Deployment Troubleshooting

## Issues Detected from Screenshots:
1. ❌ Sitemap returning "Error generating sitemap"
2. ❌ Disclaimer page showing blank screen

## Root Causes:
1. Database migration NOT run yet (sitemap needs `sitemap_cache` table)
2. Frontend NOT rebuilt (React changes not compiled)
3. Server might need restart

---

## FIX #1: Run Database Migration on Hostinger

**SSH into your Hostinger account and run:**

```bash
cd ~/domains/learnpharmacy.in/public_html
# OR wherever your app is deployed (check Hostinger file manager)

node server/migrations/add-seo-fields.js
```

**If you get "command not found" or path errors:**
```bash
# Find your app directory first
cd ~/
find . -name "server" -type d 2>/dev/null

# Then navigate to the correct path
cd /path/to/your/app
node server/migrations/add-seo-fields.js
```

**Expected Output:**
```
✅ Added column: primary_keyword
✅ Added column: target_keywords
...
✅ SEO Migration Complete!
```

---

## FIX #2: Rebuild React Frontend

The Disclaimer page and other new components need to be compiled.

**Option A: On Your Local Machine (RECOMMENDED)**
```bash
cd "C:\Users\shoai\OneDrive\Desktop\wordpress website theme\client"
npm run build
```

This creates a `dist` folder with compiled React code.

**Then you need to upload this to Hostinger:**
- Upload the entire `client/dist` folder to your Hostinger `client_build` directory
- OR configure your GitHub Actions to auto-build (if you have CI/CD)

**Option B: On Hostinger Server (if Node.js available)**
```bash
cd ~/domains/learnpharmacy.in/public_html/client
npm install
npm run build
```

---

## FIX #3: Restart Node.js Server on Hostinger

After migration and frontend build:

**From Hostinger Control Panel:**
1. Go to "Advanced" → "Node.js"
2. Find your application
3. Click "Restart"

**OR via SSH:**
```bash
# Find the process
ps aux | grep node

# Kill old process (replace XXXX with process ID)
kill -9 XXXX

# Restart (however you typically start your app)
npm start
# OR
node server/index.js
# OR
pm2 restart all
```

---

## Verification After Fixes

**Test these URLs again:**

1. ✅ https://learnpharmacy.in/sitemap-index.xml
   - Should show XML, not error

2. ✅ https://learnpharmacy.in/disclaimer  
   - Should show full Disclaimer content

3. ✅ https://learnpharmacy.in/robots.txt
   - Should show robots.txt rules

---

## If Still Not Working...

### Check Hostinger File Structure

Make sure your GitHub auto-deploy actually copied the files:

**Via File Manager, verify these exist:**
- `server/migrations/add-seo-fields.js`
- `server/routes/seo.routes.js`
- `server/services/url-mapper.js`
- `server/services/sitemap-generator.js`
- `client/src/pages/Disclaimer.jsx`
- `client/src/components/AdSlot.jsx`

**If files are missing:**
- GitHub auto-deploy might not be working
- Manually upload via FTP/File Manager
- OR fix GitHub Actions configuration

---

## Quick Diagnostic Commands

**Check if migration ran:**
```bash
# SSH into Hostinger
mysql -u YOUR_DB_USER -p YOUR_DB_NAME

# In MySQL prompt:
SHOW TABLES;
# Should see: keyword_mappings, sitemap_cache

DESCRIBE content;
# Should see: primary_keyword, target_keywords, etc.

exit
```

**Check server logs:**
```bash
# Find log location (varies by Hostinger setup)
tail -f ~/logs/nodejs.log
# OR
tail -f ~/domains/learnpharmacy.in/logs/error.log
```

---

## Most Likely Issue:

**The database migration hasn't run yet.**

Without the migration:
- ❌ Sitemap generator crashes (needs `sitemap_cache` table)
- ❌ Content routes crash (needs new columns)
- ❌ SEO API crashes (needs `keyword_mappings` table)

**Run the migration FIRST, then everything should work.**

---

## Need Help?

1. **Can't SSH?** → Use Hostinger's "Terminal" in control panel
2. **Can't find app directory?** → Go to File Manager, look for `server` folder
3. **Migration fails?** → Share the exact error message
4. **Frontend still blank?** → Check browser console for errors (F12)
