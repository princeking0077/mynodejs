# 🚀 Quick Start - VPS Deployment

## Step-by-Step Instructions

### 1️⃣ LOCAL: Prepare Files (Windows)

```bash
# Navigate to project
cd "c:\Users\shoai\OneDrive\Desktop\wordpress website theme\learnpharmacy-next"

# Build the project
npm run build

# You now have everything ready in learnpharmacy-next folder
```

### 2️⃣ UPLOAD: Choose Your Method

#### **Option A: ZIP Upload (Easiest for cPanel/Hostinger)**

1. **Compress the folder:**
   - Right-click `learnpharmacy-next` folder
   - Send to → Compressed (zipped) folder
   - Name it: `learnpharmacy.zip`

2. **What to include:** ✅
   - `.next/` folder (build output)
   - `public/` folder
   - `src/` folder  
   - `server/` folder
   - `server.js`
   - `package.json` & `package-lock.json`
   - `next.config.js`
   - `ecosystem.config.js`
   - `.env` (update credentials!)

3. **What to EXCLUDE:** ❌
   - `node_modules/` (too large, install on server)
   - `.git/`
   - Any old folders

4. **Upload via File Manager:**
   - Login to your hosting panel
   - Go to File Manager
   - Navigate to `public_html` or site root
   - Upload `learnpharmacy.zip`
   - Extract it

#### **Option B: FTP (FileZilla/WinSCP)**

1. Connect to your VPS via FTP
2. Navigate to `/var/www/html` or site directory
3. Upload the `learnpharmacy-next` folder
4. Exclude `node_modules` during upload

### 3️⃣ VPS: Setup & Install

**SSH into your server:**

```bash
# Navigate to project
cd /var/www/html/learnpharmacy-next
# OR wherever you uploaded

# Install dependencies
npm install --production

# Install server dependencies
cd server
npm install --production
cd ..

# Create required folders
mkdir -p server/uploads logs
chmod 755 server/uploads
```

### 4️⃣ VPS: Configure Environment

**Update database credentials:**

```bash
# Edit main .env
nano .env

# Edit server .env
nano server/.env
```

**Both should contain:**
```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_USER=your_actual_db_user
DB_PASS=your_actual_db_password
DB_NAME=learnpharmacy
JWT_SECRET=put_a_random_secure_string_here
```

### 5️⃣ VPS: Setup Database

```bash
# Make sure MySQL is running
sudo systemctl status mysql

# Run database seed
cd server
node seed_admin.js
cd ..
```

### 6️⃣ VPS: Start Application

```bash
# Install PM2 (if not installed)
npm install -g pm2

# Start the app
pm2 start ecosystem.config.js --env production

# Save PM2 config
pm2 save

# Auto-start on reboot
pm2 startup
# Copy and run the command it shows

# Check if running
pm2 status
pm2 logs
```

### 7️⃣ Test Your Site

**Open browser:**
- `http://your-server-ip:3000`
- Or your domain if configured

**Test admin panel:**
- Go to `/admin`
- Login with the credentials from `seed_admin.js`

## ✅ Verification Checklist

- [ ] Build completed successfully locally
- [ ] Files uploaded to VPS (excluding node_modules)
- [ ] Dependencies installed on VPS
- [ ] .env files updated with correct database credentials
- [ ] Database seeded (admin user created)
- [ ] PM2 started successfully
- [ ] Site accessible in browser
- [ ] Admin panel login works

## 🔧 Common Issues & Fixes

### "Cannot find module"
```bash
npm install --production
cd server && npm install --production
```

### "Database connection failed"
- Check .env credentials
- Verify MySQL is running: `sudo systemctl status mysql`
- Test connection: `mysql -u your_user -p`

### "Port 3000 already in use"
```bash
pm2 delete all
# Or change PORT in .env to 3001
```

### "Permission denied" for uploads
```bash
chmod 755 server/uploads
chown -R $USER:$USER server/uploads
```

## 📞 Need Help?

**View application logs:**
```bash
pm2 logs
pm2 logs --lines 200
```

**Restart application:**
```bash
pm2 restart all
```

**Stop application:**
```bash
pm2 stop all
```

## 🎯 What's Next?

1. **Setup Nginx/Apache** reverse proxy (if needed)
2. **Setup SSL certificate** for HTTPS
3. **Configure domain** to point to your server
4. **Regular backups** of database and uploads folder

For detailed instructions, see: **DEPLOYMENT_GUIDE.md**
