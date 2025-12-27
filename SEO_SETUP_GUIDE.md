# SEO System Setup & Deployment Guide

## Step 1: Database Migration

**IMPORTANT:** Run this FIRST before using any new SEO features.

```bash
cd "C:\Users\shoai\OneDrive\Desktop\wordpress website theme"
node server/migrations/add-seo-fields.js
```

This will:
- Add 13 new SEO columns to `content` table
- Create `keyword_mappings` table for anti-cannibalization
- Create `sitemap_cache` table for performance
- Add indexes for fast queries

✅ Expected output: "✅ SEO Migration Complete!"

---

## Step 2: Verify Installation

### Test Sitemap Generation
```bash
# Start server
npm start

# In browser, visit:
http://localhost:3000/sitemap-index.xml
http://localhost:3000/robots.txt
```

### Test SEO API Endpoints
```bash
# Quality Report (requires admin login)
GET http://localhost:3000/api/seo/quality-report

# Keyword Mappings
GET http://localhost:3000/api/seo/keyword-mappings
```

---

## Step 3: Admin Content Workflow (CRITICAL)

When creating/editing content through admin dashboard, **NOW include these NEW fields**:

### Required Fields for SEO:
1. **Year Slug** (e.g., "1st-year", "2nd-year")
2. **Unit Number** (e.g., 1, 2, 3...)
3. **Primary Keyword** (ONE main keyword, e.g., "pharmaceutics 1 notes")
4. **Target Keywords** (JSON array, e.g., `["drug formulation", "dosage forms"]`)

### How it Works:
When you save content, the system AUTOMATICALLY:
- Calculates word count
- Calculates reading time
- Generates canonical URL
- Creates breadcrumb trail
- Generates internal links
- Updates sitemap cache

---

## Step 4: 90-Day Publishing Schedule

### Days 1-30: Foundation
**Goal:** Establish topical authority

Upload Through Admin:
- Homepage content (optimize for "b pharm notes")
- `/bpharm` hub page (target "b pharmacy notes")
- 2 year hub pages (1st-year, 2nd-year)
- 4 subject pages (Pharmaceutics, Pharmacology, Chemistry, Pharmacognosy)
- 20 unit pages (1200+ words each)

After uploading, manually:
1. Visit Google Search Console
2. Add sitemap: `https://learnpharmacy.in/sitemap-index.xml`
3. Request indexing for core pages

### Days 31-60: Long-Tail Growth
**Goal:** Dominate long-tail keywords

Upload:
- 40-60 unit/topic pages
- MCQ-focused pages
- Solved numericals
- Short answer questions

System auto-updates sitemap daily.

### Days 61-90: Monetization
**Goal:** Traffic × RPM

Upload:
- Revision notes
- Important questions compilations
- GPAT preparation content

**After 30+ quality pages:** Apply for Google AdSense

---

## Step 5: AdSense Integration (After Approval)

### Before Applying:
- [ ] Ensure 30+ pages with 1200+ words each
- [ ] All 5 policy pages live (About, Contact, Privacy, Terms, **Disclaimer**)
- [ ] Site indexed by Google
- [ ] No policy violations

### After Approval:
1. Get AdSense Publisher ID from dashboard
2. Add to `client/index.html` `<head>`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID"
        crossorigin="anonymous"></script>
```

3. Edit `client/src/components/AdSlot.jsx`
4. Replace placeholder `<div>` with actual AdSense code (instructions in file)

---

## Step 6: SEO Quality Monitoring

### Admin Dashboard → SEO Manager

#### Check for Issues:
- **Orphan Pages:** Pages with no incoming internal links
- **Keyword Cannibalization:** Multiple pages targeting same keyword
- **Low Word Count:** Pages < 1200 words
- **Missing Keywords:** Pages without primary keyword assigned

#### Fix Issues:
```bash
# Regenerate all internal links
POST /api/seo/regenerate-links

# Invalidate sitemap cache (after bulk updates)
POST /api/seo/invalidate-sitemap
```

---

## Step 7: Google Search Console Setup

1. Go to: https://search.google.com/search-console
2. Add property: `https://learnpharmacy.in`
3. Verify ownership (HTML file upload or DNS)
4. Submit sitemap: `https://learnpharmacy.in/sitemap-index.xml`
5. Monitor:
   - Indexing status
   - Search queries
   - CTR performance
   - Core Web Vitals

---

## Step 8: Performance Optimization

### Ensure Core Web Vitals:
- **LCP < 2.5s:** Images optimized, lazy loading enabled
- **CLS < 0.1:** Ad slots have min-height, no layout shifts
- **INP < 200ms:** Minimal JavaScript, code splitting active

Test at: https://pagespeed.web.dev/

---

## Troubleshooting

### Issue: Sitemap shows 0 URLs
**Solution:** Run migration, then create at least 1 content page

### Issue: Internal links not generating
**Solution:** 
```bash
# Manual regeneration
POST /api/seo/regenerate-links
```

### Issue: Keyword cannibalization detected
**Solution:**
1. Admin → SEO Manager → Cannibalization Check
2. Identify duplicate keywords
3. Change primary keyword on one page
4. Keep best-ranking page with original keyword

### Issue: Pages not indexing
**Solution:**
1. Check `is_indexable = TRUE` in database
2. Verify robots.txt allows crawling
3. Submit URL manually in Google Search Console

---

## Maintenance Checklist (Weekly)

- [ ] Check SEO Quality Report
- [ ] Fix orphan pages
- [ ] Resolve keyword conflicts
- [ ] Update low word count pages
- [ ] Monitor AdSense RPM
- [ ] Review Google Search Console data
- [ ] Check Core Web Vitals

---

## File Structure Reference

```
server/
├── migrations/
│   └── add-seo-fields.js        → Run this first
├── services/
│   ├── url-mapper.js            → Canonical URLs, keywords
│   ├── schema-generator.js      → JSON-LD schemas
│   ├── internal-linking-engine.js → Auto-linking
│   └── sitemap-generator.js     → XML sitemaps
└── routes/
    └── seo.routes.js            → SEO API endpoints

client/src/
├── components/
│   ├── SEO.jsx                  → Meta tags + schemas
│   ├── AdSlot.jsx               → Ad placeholders
│   ├── InternalLinks.jsx        → Related content
│   └── Breadcrumbs.jsx          → Navigation trail
└── pages/
    └── Disclaimer.jsx           → Required for AdSense
```

---

## Next Steps (After Deployment)

1. ✅ Run database migration
2. ✅ Create first 5 content pages with full SEO fields
3. ✅ Verify sitemaps are generating
4. ✅ Submit sitemap to Google Search Console
5. ✅ Monitor indexing for 30 days
6. ✅ Apply for AdSense after 30+ quality pages
7. ✅ Integrate AdSense code after approval
8. ✅ Monitor RPM and optimize ad density

---

Need help? Check `/api/seo/quality-report` for detailed diagnostics.
