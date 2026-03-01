#!/bin/bash
NODE_BIN=/home/learnpharmacy/.nvm/versions/node/v22.22.0/bin
export PATH=$NODE_BIN:$PATH
export HOME=/home/learnpharmacy
export PM2_HOME=/home/learnpharmacy/.pm2
APP_DIR=/home/learnpharmacy/htdocs/www.learnpharmacy.in/learnpharmacy-next
cd $APP_DIR
pm2 restart all --update-env 2>&1 || pm2 start server.js --name learnpharmacy 2>&1
pm2 save 2>&1
pm2 list --no-color 2>&1
