#!/bin/bash

echo "========================================"
echo "Creating Deployment Package"
echo "========================================"

# Navigate to project directory
cd learnpharmacy-next

# Build the project
echo "Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi

# Go back to parent directory
cd ..

# Create deployment archive
echo "Creating deployment archive..."
tar -czf learnpharmacy-deploy-$(date +%Y%m%d-%H%M%S).tar.gz \
    --exclude='learnpharmacy-next/node_modules' \
    --exclude='learnpharmacy-next/.git' \
    --exclude='learnpharmacy-next/.next/cache' \
    --exclude='learnpharmacy-next/server/node_modules' \
    --exclude='learnpharmacy-next/server/uploads/*' \
    --exclude='learnpharmacy-next/logs' \
    learnpharmacy-next/

echo "✅ Deployment package created: learnpharmacy-deploy-$(date +%Y%m%d-%H%M%S).tar.gz"
echo ""
echo "Next steps:"
echo "1. Upload this file to your VPS"
echo "2. Extract: tar -xzf learnpharmacy-deploy-*.tar.gz"
echo "3. Follow DEPLOYMENT_GUIDE.md"
