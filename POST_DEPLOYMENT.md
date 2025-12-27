# Post-Deployment Actions for Hostinger

## ✅ Deployment Status
**Git Commit:** c60dba2  
**Status:** Pushed to GitHub → Auto-deploying to Hostinger  
**Files:** 16 changed (11 new files created)

---

## 🚨 CRITICAL: Run This FIRST on Hostinger

Once the auto-deployment completes, SSH into your Hostinger server and run:

```bash
cd /path/to/your/app  # Navigate to your app directory
node server/migrations/add-seo-fields.js
```

**Expected Output:**
```
✅ Added column: primary_keyword
✅ Added column: target_keywords
... (13 total columns)
✅ Created keyword_mappings table
✅ Created sitemap_cache table
✅ SEO Migration Complete!
```

⚠️ **If this fails:** Your database connection isn't configured. Check `server/db.js` and ensure your Hostinger database credentials are correct.

---

## 📋 Post-Migration Verification (Visit These URLs)

**After migration succeeds, test these endpoints:**

### 1. Sitemap Endpoints
- ✅ https://learnpharmacy.in/sitemap-index.xml
- ✅ https://learnpharmacy.in/sitemap-core.xml
- ✅ https://learnpharmacy.in/sitemap-content.xml
- ✅ https://learnpharmacy.in/robots.txt

**Expected:** Valid XML/text responses (not 404 or 500 errors)

### 2. Frontend Pages
- ✅ https://learnpharmacy.in/disclaimer

**Expected:** Disclaimer page loads with full content

### 3. SEO API (Admin Only - Use Postman or login first)
- https://learnpharmacy.in/api/seo/quality-report

**Expected:** JSON response with SEO health metrics

---

## 📝 Content Upload Workflow (Admin Dashboard)

When you create content through your admin panel, **NOW include these NEW fields:**

| Field | Example Value | Required? |
|-------|---------------|-----------|
| **Year Slug** | `1st-year`, `2nd-year`, `3rd-year`, `4th-year` | ✅ Yes |
| **Unit Number** | `1`, `2`, `3`, ... | ✅ Yes |
| **Primary Keyword** | `pharmaceutics 1 notes` | ✅ **CRITICAL** |
| **Target Keywords** | `["drug formulation", "dosage forms"]` | Optional |

### What Happens Automatically:
When you save content, the system will:
- ✅ Calculate word count from your content
- ✅ Calculate reading time (based on 200 words/min)
- ✅ Generate canonical URL (e.g., `https://learnpharmacy.in/bpharm/1st-year/pharmaceutics-1/unit-1`)
- ✅ Create breadcrumb trail
- ✅ Generate internal links (parent, siblings, related topics, prev/next)
- ✅ Update sitemap cache

---

## 🗓️ 90-Day Publishing Plan (START NOW)

### Phase 1: Days 1-30 (Foundation)
**Goal:** Get indexed by Google

**Upload:**
- Homepage (optimize for "b pharm notes")
- `/bpharm` hub page
- 2 year pages (1st-year, 2nd-year)
- 4 subject pages
- **20 unit pages (1200+ words EACH)**

**After uploading:**
1. Go to Google Search Console
2. Add property: `https://learnpharmacy.in`
3. Submit sitemap: `https://learnpharmacy.in/sitemap-index.xml`
4. Manually request indexing for homepage and `/bpharm` hub

### Phase 2: Days 31-60 (Long-Tail)
**Goal:** Long-tail keyword dominance

**Upload:**
- 40-60 unit pages
- MCQ pages
- Solved numericals

**System handles:** Sitemap updates automatically

### Phase 3: Days 61-90 (Monetization)
**Goal:** AdSense approval + RPM growth

**Upload:**
- Revision notes
- Important questions
- GPAT prep content

**After 30+ pages with 1200+ words:**
→ Apply for Google AdSense

---

## 💰 AdSense Integration (After Approval)

### Step 1: Get Your Publisher ID
After AdSense approval, you'll receive a Publisher ID like: `ca-pub-1234567890123456`

### Step 2: Add AdSense Script to Your Site
SSH into Hostinger and edit:
```bash
nano client/index.html
```

Add this inside `<head>`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
        crossorigin="anonymous"></script>
```

### Step 3: Activate Ad Slots
Edit this file on Hostinger:
```bash
nano client/src/components/AdSlot.jsx
```

Follow the instructions in the comments at the bottom of the file to replace placeholders with actual AdSense code.

### Step 4: Rebuild Frontend
```bash
cd client
npm run build
# Copy build to client_build directory (your deployment process)
```

---

## 🔍 SEO Quality Monitoring

### Check SEO Health (Weekly)
Visit: https://learnpharmacy.in/api/seo/quality-report (admin login required)

**Monitor:**
- Orphan pages (should be 0)
- Keyword cannibalization (should be 0)
- Pages without keywords
- Pages with low word count (< 1200)

### Fix Issues:
If you see problems, run:
```bash
# Regenerate all internal links
curl -X POST https://learnpharmacy.in/api/seo/regenerate-links -H "Authorization: Bearer YOUR_TOKEN"

# Invalidate sitemap cache
curl -X POST https://learnpharmacy.in/api/seo/invalidate-sitemap -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Success Metrics (Track Weekly)

| Metric | Target | Check Where |
|--------|--------|-------------|
| **Indexed Pages** | 30+ by Day 30 | Google Search Console |
| **Avg Word Count** | 1200+ words | SEO Quality Report API |
| **Orphan Pages** | 0 | SEO Quality Report API |
| **Cannibalization** | 0 | SEO Quality Report API |
| **LCP** | < 2.5s | PageSpeed Insights |
| **Mobile Score** | > 90 | PageSpeed Insights |

---

## 🆘 Troubleshooting

### Issue: Migration fails with database error
**Solution:** 
- Check your Hostinger database credentials in `server/db.js`
- Ensure database name, host, username, password are correct
- Try connecting via phpMyAdmin first to test credentials

### Issue: Sitemaps return 404
**Solution:**
- Ensure migration ran successfully (creates `sitemap_cache` table)
- Check server logs for errors
- Restart Node.js server on Hostinger

### Issue: Content saves but no SEO fields populated
**Solution:**
- Ensure migration created all 13 new columns
- Check browser console for errors when saving content
- Verify `yearSlug`, `unitNumber`, `primaryKeyword` are being sent in request

---

## 📞 Next Steps (DO IN ORDER)

1. ✅ **Wait for Hostinger auto-deployment** (should take 2-5 minutes)
2. ✅ **SSH into Hostinger** and run database migration
3. ✅ **Test sitemap URLs** (visit /sitemap-index.xml)
4. ✅ **Test Disclaimer page** (visit /disclaimer)
5. ✅ **Upload first content** with new SEO fields
6. ✅ **Check SEO Quality Report** (/api/seo/quality-report)
7. ✅ **Submit sitemap to Google Search Console**
8. ✅ **Continue 90-day publishing plan**

---

**Questions?** Check `SEO_SETUP_GUIDE.md` for detailed documentation.
