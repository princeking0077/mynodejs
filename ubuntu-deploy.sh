#!/bin/bash

##############################################
# LearnPharmacy - Ubuntu Fresh Server Setup
# Complete automated deployment
##############################################

set -e  # Exit on any error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "========================================="
echo "  LearnPharmacy Ubuntu Deployment"
echo "  Fresh Server Setup"
echo "========================================="
echo -e "${NC}"

# Configuration
DOMAIN="www.learnpharmacy.in"
DOMAIN_ALT="learnpharmacy.in"
DB_NAME="learnpharmacy"
DB_USER="learnpharmacy_user"
DB_PASS="Pharmacy@2024Secure#"
ADMIN_EMAIL="shoaib.ss300@gmail.com"
GIT_REPO="https://github.com/princeking0077/mynodejs.git"
PROJECT_DIR="/var/www/learnpharmacy"

# Step 1: Update System
echo -e "${BLUE}[1/12] Updating system packages...${NC}"
apt update && apt upgrade -y

# Step 2: Install Node.js 20.x LTS
echo -e "${BLUE}[2/12] Installing Node.js 20.x LTS...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version
npm --version

# Step 3: Install MySQL
echo -e "${BLUE}[3/12] Installing MySQL Server...${NC}"
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql

# Secure MySQL installation (Ubuntu 24.04 uses auth_socket by default)
echo -e "${YELLOW}Securing MySQL installation...${NC}"
sudo mysql <<MYSQL_SECURE
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'RootPassword@2024#';
DELETE FROM mysql.user WHERE User='';
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';
FLUSH PRIVILEGES;
MYSQL_SECURE

# Step 4: Create Database and User
echo -e "${BLUE}[4/12] Creating database and user...${NC}"
mysql -uroot -p'RootPassword@2024#' <<MYSQL_SCRIPT
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
MYSQL_SCRIPT

echo -e "${GREEN}✓ Database created successfully${NC}"

# Step 5: Install PM2
echo -e "${BLUE}[5/12] Installing PM2...${NC}"
npm install -g pm2
pm2 startup systemd -u root --hp /root
systemctl enable pm2-root

# Step 6: Install Nginx
echo -e "${BLUE}[6/12] Installing Nginx...${NC}"
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# Step 7: Clone Repository
echo -e "${BLUE}[7/12] Cloning repository...${NC}"
mkdir -p /var/www
cd /var/www
if [ -d "$PROJECT_DIR" ]; then
    echo "Removing existing directory..."
    rm -rf "$PROJECT_DIR"
fi
git clone "$GIT_REPO" "$PROJECT_DIR"
cd "$PROJECT_DIR/learnpharmacy-next"

# Step 8: Configure Environment Variables
echo -e "${BLUE}[8/12] Configuring environment variables...${NC}"

# Root .env
cat > .env <<ENV_ROOT
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SITE_URL=https://${DOMAIN}
DB_HOST=localhost
DB_USER=${DB_USER}
DB_PASS=${DB_PASS}
DB_NAME=${DB_NAME}
JWT_SECRET=$(openssl rand -base64 32)
ENV_ROOT

# Server .env
cat > server/.env <<ENV_SERVER
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_USER=${DB_USER}
DB_PASS=${DB_PASS}
DB_NAME=${DB_NAME}
JWT_SECRET=$(openssl rand -base64 32)
ENV_SERVER

echo -e "${GREEN}✓ Environment configured${NC}"

# Step 9: Install Dependencies and Build
echo -e "${BLUE}[9/12] Installing dependencies...${NC}"
npm install --production

echo -e "${BLUE}Building Next.js application...${NC}"
npm run build

# Create necessary directories
mkdir -p server/uploads logs server/migrations
chmod 755 server/uploads

# Step 10: Initialize Database Schema
echo -e "${BLUE}[10/12] Initializing database schema...${NC}"

mysql -u${DB_USER} -p${DB_PASS} ${DB_NAME} <<SCHEMA
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('bpharm', 'gpat', 'general') DEFAULT 'general',
    semester INT,
    year_slug VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create content table
CREATE TABLE IF NOT EXISTS content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_id VARCHAR(50),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    blog_content LONGTEXT,
    youtube_id VARCHAR(50),
    meta_title VARCHAR(255),
    meta_description TEXT,
    primary_keyword VARCHAR(255),
    target_keywords JSON,
    canonical_url VARCHAR(500),
    breadcrumb_path JSON,
    content_word_count INT DEFAULT 0,
    reading_time_minutes INT DEFAULT 0,
    unit_number INT,
    year_slug VARCHAR(50),
    faqs JSON,
    quiz_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    INDEX idx_subject_id (subject_id),
    INDEX idx_slug (slug),
    INDEX idx_created_at (created_at DESC)
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    key_name VARCHAR(100) UNIQUE NOT NULL,
    value LONGTEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
SCHEMA

# Create admin user
echo -e "${BLUE}Creating admin user...${NC}"
cd server
node seed_admin.js
cd ..

echo -e "${GREEN}✓ Database initialized${NC}"

# Step 11: Configure PM2
echo -e "${BLUE}[11/12] Starting application with PM2...${NC}"

cat > ecosystem.config.js <<PM2_CONFIG
module.exports = {
  apps: [{
    name: 'learnpharmacy',
    script: 'server.js',
    cwd: '/var/www/learnpharmacy/learnpharmacy-next',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false
  }]
};
PM2_CONFIG

pm2 start ecosystem.config.js
pm2 save

echo -e "${GREEN}✓ Application started with PM2${NC}"

# Step 12: Configure Nginx
echo -e "${BLUE}[12/12] Configuring Nginx...${NC}"

cat > /etc/nginx/sites-available/learnpharmacy <<NGINX_CONFIG
# Rate limiting
limit_req_zone \$binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=api:10m rate=30r/s;

server {
    listen 80;
    server_name ${DOMAIN} ${DOMAIN_ALT};

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Client max body size
    client_max_body_size 200M;

    # Logs
    access_log /var/log/nginx/learnpharmacy_access.log;
    error_log /var/log/nginx/learnpharmacy_error.log;

    # Rate limiting
    limit_req zone=general burst=20 nodelay;

    # API rate limiting
    location /api/ {
        limit_req zone=api burst=50 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Main proxy
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
NGINX_CONFIG

# Enable site
ln -sf /etc/nginx/sites-available/learnpharmacy /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t
systemctl reload nginx

echo -e "${GREEN}✓ Nginx configured${NC}"

# Install SSL Certificate
echo -e "${BLUE}Installing SSL certificate...${NC}"
apt install -y certbot python3-certbot-nginx
certbot --nginx -d ${DOMAIN} -d ${DOMAIN_ALT} --non-interactive --agree-tos -m ${ADMIN_EMAIL} --redirect

# Setup auto-renewal
systemctl enable certbot.timer

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  ✓ DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}Application Details:${NC}"
echo -e "  • URL: https://${DOMAIN}"
echo -e "  • Admin Panel: https://${DOMAIN}/admin"
echo -e "  • Admin Email: ${ADMIN_EMAIL}"
echo -e "  • Admin Password: Shaikh@#\$001"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo -e "  • View logs: pm2 logs"
echo -e "  • Restart app: pm2 restart learnpharmacy"
echo -e "  • Check status: pm2 status"
echo -e "  • Nginx logs: tail -f /var/log/nginx/learnpharmacy_*.log"
echo ""
echo -e "${BLUE}Database Details:${NC}"
echo -e "  • Database: ${DB_NAME}"
echo -e "  • User: ${DB_USER}"
echo -e "  • Password: ${DB_PASS}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Visit https://${DOMAIN} to verify deployment"
echo -e "  2. Login to admin panel and add content"
echo -e "  3. Configure DNS if not already done"
echo ""
