#!/bin/bash
export NVM_DIR=/home/learnpharmacy/.nvm
if [ -f "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
fi
nvm use default
cd /home/learnpharmacy/htdocs/www.learnpharmacy.in/learnpharmacy-next
pm2 restart learnpharmacy --update-env
pm2 logs learnpharmacy --lines 50 --nostream
