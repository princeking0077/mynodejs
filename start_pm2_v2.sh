#!/bin/bash
export NVM_DIR=/home/learnpharmacy/.nvm
if [ -f "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
fi
nvm use default
npm install -g pm2
cd /home/learnpharmacy/htdocs/www.learnpharmacy.in/learnpharmacy-next
pm2 start server.js --name "learnpharmacy" --env production
pm2 save
pm2 status
