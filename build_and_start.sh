#!/bin/bash
export NVM_DIR=/home/learnpharmacy/.nvm
[ -f "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use default

echo "Node: $(which node)"
echo "NPM: $(which npm)"
echo "PM2: $(which pm2)"

APP_DIR=/home/learnpharmacy/htdocs/www.learnpharmacy.in/learnpharmacy-next

cd "$APP_DIR"
chmod -R 755 node_modules/.bin

echo "=== Building Next.js ==="
npm run build 2>&1 | tail -20

echo "=== Starting PM2 ==="
pm2 delete learnpharmacy 2>/dev/null || true
pm2 start server.js --name "learnpharmacy" --env production
pm2 save

echo "=== Status ==="
pm2 status
