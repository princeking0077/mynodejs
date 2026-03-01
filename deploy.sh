#!/bin/bash

# LearnPharmacy - Automated Deployment Script
# This script automates the deployment process to the VPS

set -e  # Exit on any error

echo "======================================"
echo "LearnPharmacy Deployment Script"
echo "======================================"
echo ""

# Configuration - UPDATE THESE VALUES
VPS_USER="your_username"
VPS_HOST="your_vps_ip"
VPS_PATH="/var/www/learnpharmacy-next"
PROJECT_DIR="learnpharmacy-next"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Build locally
echo -e "${BLUE}[1/6] Building Next.js application...${NC}"
cd "$PROJECT_DIR"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completed successfully${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi
cd ..

# Step 2: Create deployment package
echo -e "${BLUE}[2/6] Creating deployment package...${NC}"
tar -czf deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next/cache' \
    --exclude='*.log' \
    --exclude='.env.local' \
    "$PROJECT_DIR"

if [ -f "deploy.tar.gz" ]; then
    echo -e "${GREEN}✓ Package created: $(du -h deploy.tar.gz | cut -f1)${NC}"
else
    echo -e "${RED}✗ Failed to create package${NC}"
    exit 1
fi

# Step 3: Upload to VPS
echo -e "${BLUE}[3/6] Uploading to VPS...${NC}"
scp deploy.tar.gz "$VPS_USER@$VPS_HOST:/tmp/"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Upload completed${NC}"
else
    echo -e "${RED}✗ Upload failed${NC}"
    exit 1
fi

# Step 4: Deploy on VPS
echo -e "${BLUE}[4/6] Deploying on VPS...${NC}"
ssh "$VPS_USER@$VPS_HOST" << 'ENDSSH'
set -e

# Stop current application
echo "→ Stopping current application..."
pm2 stop learnpharmacy || true

# Backup current version
if [ -d "/var/www/learnpharmacy-next" ]; then
    echo "→ Backing up current version..."
    mv /var/www/learnpharmacy-next "/var/www/learnpharmacy-next-backup-$(date +%Y%m%d-%H%M%S)" || true
fi

# Extract new version
echo "→ Extracting new version..."
cd /var/www
tar -xzf /tmp/deploy.tar.gz
rm /tmp/deploy.tar.gz

# Install dependencies
echo "→ Installing dependencies..."
cd learnpharmacy-next
npm install --production

# Create necessary directories
echo "→ Creating directories..."
mkdir -p server/uploads logs
chmod 755 server/uploads

echo "✓ Deployment completed"
ENDSSH

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Deployment successful${NC}"
else
    echo -e "${RED}✗ Deployment failed${NC}"
    exit 1
fi

# Step 5: Restart application
echo -e "${BLUE}[5/6] Restarting application...${NC}"
ssh "$VPS_USER@$VPS_HOST" << 'ENDSSH'
cd /var/www/learnpharmacy-next
pm2 restart learnpharmacy || pm2 start ecosystem.config.js
pm2 save
ENDSSH

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Application restarted${NC}"
else
    echo -e "${RED}✗ Restart failed${NC}"
    exit 1
fi

# Step 6: Check status
echo -e "${BLUE}[6/6] Checking application status...${NC}"
ssh "$VPS_USER@$VPS_HOST" "pm2 status && pm2 logs --lines 20"

# Cleanup
rm deploy.tar.gz

echo ""
echo -e "${GREEN}======================================"
echo "Deployment Completed Successfully!"
echo "======================================${NC}"
echo ""
echo "Your application is now running on the VPS"
echo "Check logs with: ssh $VPS_USER@$VPS_HOST 'pm2 logs'"
echo ""
