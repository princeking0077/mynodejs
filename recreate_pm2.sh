#!/bin/bash
export NVM_DIR=/home/learnpharmacy/.nvm
if [ -f "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
fi
nvm use default
cd /home/learnpharmacy/htdocs/www.learnpharmacy.in/learnpharmacy-next
pm2 delete learnpharmacy || true
pm2 start server.js --name "learnpharmacy" --env production
pm2 save
pm2 logs learnpharmacy --lines 20 --nostream
