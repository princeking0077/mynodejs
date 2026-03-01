# 🚀 LearnPharmacy - Quick Deployment Instructions

## ✅ What's Been Done

### Local Changes Completed:
- ✅ **Toast Notifications** - Replaced alerts with modern toast system
- ✅ **Skeleton Loaders** - Added loading animations for better UX
- ✅ **Content Preview** - Preview content before publishing
- ✅ **Analytics Dashboard** - Track content statistics
- ✅ **Database Indexes** - Improved query performance
- ✅ **Dropdown Fixes** - Fixed color visibility in admin panel
- ✅ **Production Build** - Next.js app built and optimized
- ✅ **Git Commit** - All changes committed and pushed to GitHub

### Deployment Package Created:
📦 **learnpharmacy-deployment-20260302-014801.tar.gz** (71 MB)

---

## 🎯 Deploy to Your VPS (Choose One Method)

### Method 1: Automated Deployment (Recommended)

**Prerequisites:**
- SSH access to your VPS
- PM2 installed on VPS

**Steps:**

1. **Edit deploy.sh** and update these values:
   ```bash
   VPS_USER="your_username"
   VPS_HOST="your_vps_ip_or_domain"
   ```

2. **Run deployment script:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

The script will:
- Build the application
- Create deployment package
- Upload to VPS
- Extract and install dependencies
- Restart PM2
- Show logs

---

### Method 2: Manual Deployment

#### On Your Local Machine:

**Option A - Use the batch file (Windows):**
```cmd
DEPLOY.bat
```

**Option B - Use existing package:**
The package is already created: `learnpharmacy-deployment-20260302-014801.tar.gz`

#### Upload to VPS:

**Using SCP:**
```bash
scp learnpharmacy-deployment-20260302-014801.tar.gz user@your-vps:/tmp/
```

**Using FTP/SFTP:**
- Use FileZilla, WinSCP, or cPanel File Manager
- Upload the .tar.gz file to /tmp/ directory

#### On Your VPS (via SSH):

```bash
# 1. Stop current application
pm2 stop learnpharmacy

# 2. Backup current version (optional)
cd /var/www
mv learnpharmacy-next learnpharmacy-next-backup-$(date +%Y%m%d)

# 3. Extract new version
cd /var/www
tar -xzf /tmp/learnpharmacy-deployment-20260302-014801.tar.gz
cd learnpharmacy-next

# 4. Install dependencies
npm install --production

# 5. Ensure directories exist
mkdir -p server/uploads logs
chmod 755 server/uploads

# 6. Update environment variables (if needed)
nano .env
nano server/.env

# 7. Restart application
pm2 restart learnpharmacy
# OR if first time:
# pm2 start ecosystem.config.js
# pm2 save

# 8. Check status
pm2 status
pm2 logs --lines 50
```

---

### Method 3: Pull from GitHub (If Your VPS Has Git Access)

```bash
# SSH into VPS
ssh user@your-vps

# Navigate to project
cd /var/www/learnpharmacy-next

# Stop application
pm2 stop learnpharmacy

# Pull latest changes
git pull origin main

# Rebuild
npm install
npm run build

# Restart
pm2 restart learnpharmacy

# Check logs
pm2 logs
```

---

## 🔍 Verify Deployment

After deployment, check:

1. **Application Status:**
   ```bash
   pm2 status
   ```

2. **View Logs:**
   ```bash
   pm2 logs learnpharmacy --lines 100
   ```

3. **Test Website:**
   - Visit your website URL
   - Test admin panel login
   - Try creating/editing content
   - Check toast notifications appear
   - Verify preview button works
   - Check skeleton loaders during page load

4. **Database Connection:**
   ```bash
   pm2 logs | grep -i "database\|mysql\|connected"
   ```

---

## 🎨 New Features Available

### For Admins:

1. **Toast Notifications**
   - Success/error messages now appear as elegant toast notifications
   - Auto-dismiss after 3 seconds
   - No more browser alerts!

2. **Content Preview**
   - Click "Preview" button in content forms
   - See exactly how content will look before publishing
   - Preview YouTube embeds, formatting, and SEO data

3. **Better Loading States**
   - Skeleton loaders show while content is loading
   - Improved perceived performance

4. **Analytics Dashboard** (Ready for integration)
   - API endpoint: `/api/analytics/stats`
   - Track total content, B.Pharm/GPAT distribution
   - Monitor weekly growth

---

## 🐛 Troubleshooting

### Application Won't Start:
```bash
pm2 logs learnpharmacy --lines 100
pm2 delete learnpharmacy
pm2 start ecosystem.config.js
```

### Database Connection Issues:
```bash
# Check .env files have correct credentials
cat .env | grep DB_
cat server/.env | grep DB_

# Test MySQL connection
mysql -u your_user -p your_database
```

### Port Already in Use:
```bash
# Find what's using port 3000
sudo lsof -i :3000
# Kill it if needed
sudo kill -9 <PID>
# Restart PM2
pm2 restart learnpharmacy
```

### Changes Not Appearing:
```bash
# Clear Next.js cache
rm -rf .next/cache
# Rebuild
npm run build
# Hard restart PM2
pm2 restart learnpharmacy --update-env
```

---

## 📊 Files Changed in This Deployment

### New Components:
- `src/components/Toast.jsx` - Toast notification system
- `src/components/Skeleton.jsx` - Loading skeletons
- `src/components/ContentPreview.jsx` - Content preview modal
- `src/components/AnalyticsDashboard.jsx` - Analytics dashboard

### Updated Files:
- `src/pages/admin/bpharm-content.js` - Integrated new features
- `src/pages/admin/gpat-content.js` - Integrated new features
- `server/routes/analytics.routes.js` - Analytics API

### Database Changes:
- Added indexes: `subject_id`, `slug`, `created_at` on `content` table

---

## 📝 Environment Variables

Ensure these are set in `.env` and `server/.env`:

```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=learnpharmacy
JWT_SECRET=your_secure_random_string_here
NEXT_PUBLIC_API_URL=
```

---

## ✅ Post-Deployment Checklist

- [ ] Application is running (`pm2 status`)
- [ ] No errors in logs (`pm2 logs`)
- [ ] Website loads correctly
- [ ] Admin panel accessible
- [ ] Can create/edit content
- [ ] Toast notifications working
- [ ] Preview button functional
- [ ] Skeleton loaders appearing during load
- [ ] Database queries faster (thanks to indexes)

---

## 📞 Need Help?

If you encounter issues:
1. Check PM2 logs: `pm2 logs --lines 200`
2. Check server error logs: `cat logs/error.log`
3. Verify database connection
4. Ensure all npm packages installed
5. Check file permissions on uploads folder

---

## 🎉 Success!

Your LearnPharmacy platform is now deployed with the latest improvements:
- Modern toast notifications
- Elegant content previews
- Smooth loading animations
- Performance optimizations
- Better admin experience

Happy learning! 📚
