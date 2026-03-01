# VPS Deployment Guide for LearnPharmacy

## 🚀 Quick Deployment Steps

### Step 1: Clean Old Files on VPS

**SSH into your VPS and run:**
```bash
# Stop old application
pm2 stop all
pm2 delete all

# Backup old files (if any)
cd /var/www  # or wherever your site is
mv html html-backup-$(date +%Y%m%d)
mkdir -p html
```

### Step 2: Files to Upload

**✅ Upload these folders/files to your VPS:**
```
learnpharmacy-next/
├── .next/              (Build output - run npm run build first!)
├── public/             
├── src/                
├── server/             
├── server.js           
├── package.json
├── package-lock.json
├── next.config.js
├── ecosystem.config.js
└── .env               (Update with your VPS database credentials)
```

**❌ DO NOT Upload:**
- node_modules/
- .git/
- client/ (old app)
- dist/, deployment/, any old build folders

### Step 3: Before Upload - Build Locally

```bash
# On your local machine
cd learnpharmacy-next
npm run build
```

### Step 4: Upload Methods

**Option A - Using cPanel File Manager:**
1. Compress learnpharmacy-next folder (exclude node_modules, .git)
2. Upload ZIP to cPanel
3. Extract in public_html or desired directory

**Option B - Using FTP/SFTP:**
1. Use FileZilla or WinSCP
2. Upload learnpharmacy-next folder
3. Exclude node_modules, .git

**Option C - Using SCP (Command Line):**
```bash
# Create deployment archive
tar -czf deploy.tar.gz --exclude='node_modules' --exclude='.git' learnpharmacy-next/

# Upload to server
scp deploy.tar.gz user@your-vps:/var/www/
```

### Step 5: Setup on VPS

```bash
# SSH into VPS
ssh user@your-vps-ip

# Navigate to web directory
cd /var/www

# Extract (if using tar)
tar -xzf deploy.tar.gz

# Enter project
cd learnpharmacy-next

# Install dependencies
npm install --production

# Create uploads folder
mkdir -p server/uploads
chmod 755 server/uploads

# Create logs folder
mkdir -p logs
```

### Step 6: Configure Database

**Update `.env` files:**
```bash
nano server/.env
nano .env
```

Set correct database credentials:
```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=learnpharmacy
JWT_SECRET=change_to_random_secure_string
```

**Run database setup:**
```bash
cd server
node seed_admin.js
cd ..
```

### Step 7: Start with PM2

```bash
# Install PM2 globally (if not installed)
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save

# Auto-start on server reboot
pm2 startup
# Run the command PM2 outputs

# Check status
pm2 status
pm2 logs
```

### Step 8: Setup Nginx (if not using Apache)

```bash
sudo nano /etc/nginx/sites-available/learnpharmacy
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 50M;
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/learnpharmacy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Setup SSL (Recommended)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 🔧 Quick Commands

**View Logs:**
```bash
pm2 logs
pm2 logs --lines 100
```

**Restart App:**
```bash
pm2 restart all
```

**Stop App:**
```bash
pm2 stop all
```

**Update App:**
```bash
cd /var/www/learnpharmacy-next
npm run build
pm2 restart all
```

## 📋 Checklist

- [ ] Build project locally (`npm run build`)
- [ ] Upload files to VPS (exclude node_modules, .git)
- [ ] Install dependencies on VPS (`npm install --production`)
- [ ] Update .env with correct database credentials
- [ ] Run database migrations
- [ ] Start with PM2
- [ ] Setup Nginx reverse proxy
- [ ] Setup SSL certificate
- [ ] Test website

## 🐛 Troubleshooting

**App won't start:**
```bash
pm2 logs  # Check error logs
pm2 delete all && pm2 start ecosystem.config.js
```

**Database errors:**
- Verify .env credentials
- Check MySQL is running: `sudo systemctl status mysql`

**Port already in use:**
```bash
pm2 delete all
sudo lsof -i :3000
```
