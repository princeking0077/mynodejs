## LearnPharmacy.in Next.js Hostinger Deployment Guide

This guide covers deploying the newly migrated Next.js application to your Hostinger hPanel environment using Node.js via your auto-deploy GitHub repository (`princeking0077/mynodejs/learnpharmacy-next`).

### 1. Hostinger Control Panel Setup

1. Login to **hPanel** and go to **Advanced > Node.js**.
2. If you don't have a Node.js application, click **Create Application**.
3. Fill out the application details:
   * **Node.js Version:** Select **v18.x** or **v20.x**.
   * **Application Mode:** `Production`.
   * **Application URL:** `learnpharmacy.in` (and any subdomains).
   * **Application Root:** Select your specific project directory (`/public_html/learnpharmacy-next` depending on how git clones into your hPanel file manager).
   * **Startup File:** `node_modules/next/dist/bin/next`

### 2. Configure GitHub Auto-Deployment

1. In hPanel, go to **Advanced > GIT**.
2. Ensure your repository (`princeking0077/mynodejs`) is connected.
3. Your **Branch** should be set to `main`.
4. The deployment path must point to where the application root is.
5. Setup the **Auto Deployment Webhook** in your GitHub Repository Settings (Settings > Webhooks) so every `git push` updates your server files automatically.

### 3. Build & Run Application (via SSH or hPanel Terminal)

Because Next.js requires a build step for `getStaticProps` to render the SEO dynamically:

1. Open **SSH/Terminal** via hPanel.
2. Navigate to your application directory:
   ```bash
   cd public_html/learnpharmacy-next
   ```
3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
4. Build the Next.js Production App:
   ```bash
   npm run build
   ```
5. Start the application. (If using Hostinger's Node.js Dashboard, simply click **START/RESTART**. If running via terminal PM2 for persistence):
   ```bash
   npx pm2 start npm --name "learnpharmacy-next" -- run start
   npx pm2 save
   ```

### 4. Reverse Proxy / .htaccess Configuration
If Hostinger is running Apache in front of your Node.js app, ensure you create/update the `.htaccess` file in your main `public_html` directory to proxy traffic to your Next.js port (default 3000):

```apache
RewriteEngine On
RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
```

### 5. Validate Deployment
1. Hit `https://learnpharmacy.in` in an incognito window.
2. View Page Source -> Search for `<meta name="description"` to ensure it isn't rendered via JS anymore but physically in the HTML markup.
3. Access `https://learnpharmacy.in/sitemap.xml` to verify it loads correctly.
