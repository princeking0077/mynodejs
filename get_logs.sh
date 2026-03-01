#!/bin/bash
export NVM_DIR=/home/learnpharmacy/.nvm
if [ -f "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
fi
nvm use default
pm2 logs learnpharmacy --lines 100 --nostream
