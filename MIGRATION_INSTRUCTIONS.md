# How to Run the Database Migration

## ✅ YOU NOW HAVE: `RUN_THIS_IN_PHPMYADMIN.sql`

This file contains all the SQL commands to add SEO features to your database.

---

## Step-by-Step Instructions:

### 1. Log into Hostinger
- Go to https://hostinger.com
- Log in to your account
- Go to your hosting panel

### 2. Open phpMyAdmin
- In Hostinger panel, find "Databases"
- Click "phpMyAdmin" button
- You'll see your database listed

### 3. Select Your Database
- Click on your database name (left sidebar)
- It will expand to show tables
- You should see tables like: `content`, `users`, `curriculum`, etc.

### 4. Run the Migration
- Click **"SQL"** tab at the top
- Open the file: `RUN_THIS_IN_PHPMYADMIN.sql`
- **Copy ALL the contents** (Ctrl+A, Ctrl+C)
- **Paste into the SQL box** in phpMyAdmin
- Click the **"Go"** button (bottom right)

### 5. Verify Success
You should see output like:
```
✓ Query OK, X rows affected
✓ Migration completed successfully!
✓ new_columns_added: 13
```

If you see **any errors**, take a screenshot and show me.

---

## After Migration Succeeds:

### 1. Go to Admin Dashboard
- Log out if logged in (to get fresh token)
- Log back in

### 2. Edit Your GPAT Content
- Select the subject
- Edit "Introduction to Pharmacology"
- Fill in the SEO fields:
  - **GPAT / Competitive** (from dropdown)
  - **Day Number:** 1
  - **Primary Keyword:** fundamentals of pharmacology gpat notes
  - **Target Keywords:** introduction to pharmacology gpat, pharmacology basics for gpat, pharmacokinetics and pharmacodynamics notes
- Click **Save Topic**

### 3. View the Page
- Go to the page: `/subject/day-1/introduction-to-pharmacology`
- **Hard refresh:** Ctrl+Shift+R
- You should now see:
  - ✅ **Breadcrumbs** at top (Home → GPAT → Day 1)
  - ✅ **Proper meta tags** (view page source)
  - ✅ **Internal links** at bottom (once more content exists)

---

## If Something Goes Wrong:

**Error: "Table already exists"**
→ This is OK! It means part of migration already ran. Keep going.

**Error: "Column already exists"**  
→ This is OK! Skip to re-saving content in admin.

**Error: "Access denied"**
→ You don't have permission. Contact Hostinger support.

**Still no breadcrumbs after saving?**
→ Take screenshot of:
1. Admin form filled out
2. Frontend page (with F12 console open)
3. Network tab showing API response

And I'll help debug!

---

**Ready to go! Open phpMyAdmin and paste the SQL file.** 🚀
