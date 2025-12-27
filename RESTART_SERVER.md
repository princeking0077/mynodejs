# URGENT: Manual Server Restart Needed

The code is deployed but Node.js server needs restart to load new imports.

## You Have SSH Open - Let's Restart the Server:

In your SSH terminal (u480091743@93.127.208.104), run:

```bash
# 1. Find the Node.js process
pm2 list
# OR
ps aux | grep node

# 2. Restart the server
pm2 restart all
# OR if not using PM2:
pkill -9 node
cd /path/to/your/app
node server/index.js &

# 3. Check if it's running
pm2 status
# OR
ps aux | grep node
```

## After Restart:

1. Wait 30 seconds
2. Go to admin
3. Edit "Introduction to Pharmacology"
4. Click **Save** (don't change anything)
5. Check database again - canonical_url should have value!

## Don't Know Which Command?

Run this in SSH:
```bash
pm2 list
```

If you see output → use `pm2 restart all`  
If "command not found" → contact Hostinger support to restart Node.js app

**The code is ready, it just needs the server to restart!**
