# Hostinger/Node.js Deployment Runbook

This guide outlines the steps to deploy the "Apex Apps" Node.js backend to Hostinger, utilizing the existing helper scripts.

## 1. Prerequisites
- **MySQL Database**: Create a database on Hostinger. Note down:
    - `DB_HOST`
    - `DB_USER`
    - `DB_PASS`
    - `DB_NAME`
- **Secrets**: Generate a strong `JWT_SECRET`.
- **Port**: Decide on a port (e.g., 3000, 8080). Hostinger often ignores this for Passenger applications, but it's good to have in `.env`.

## 2. Prepare the Upload Package
You need a clean directory containing only the necessary production files.
1.  **Create a folder** (e.g., `deploy_bundle`).
2.  **Copy the following files/folders** into it:
    - `index.js`
    - `package.json`
    - `.env.example` (rename to `.env` on server)
    - `db.js`
    - `routes/`
    - `middleware/`
    - `client_build/` (Ensure this contains your React build)
    - **Helper Scripts**:
        - `update_schema.js`
        - `setup_slugs.js`
        - `seed_admin.js`
        - `setup.js` (if needed)

> **Tip**: Do NOT upload `node_modules`. You will install dependencies on the server.

## 3. Upload & Install
1.  **Upload**: Upload the files (or a zip of them) to your app directory on Hostinger.
2.  **Install Dependencies**:
    - Open the Terminal (SSH) or use Hostinger's Node.js manager console.
    - Navigate to the app root.
    - Run:
      ```bash
      npm install
      ```

## 4. Configuration
Create a `.env` file in the application root with your credentials:
```env
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASS=your-db-pass
DB_NAME=your-db-name
JWT_SECRET=your-strong-secret
PORT=3000
```

## 5. Database Setup & Migration
Run these commands in order to align the schema and seed data.
```bash
# 1. Initialize Schema & Seed Defaults
npm run setup 
# (This runs 'node setup.js', creating tables like 'content', 'users', 'settings')

# 2. Ensure Schema Updates
node update_schema.js

# 3. Backfill Slugs
node setup_slugs.js

# 4. Seed Admin User
node seed_admin.js
```

## 6. Start the Server
- **Using PM2** (Recommended):
  ```bash
  pm2 start index.js --name apexapps
  ```

## 7. Verification (Smoke Test)
- **Health Check**:
  `curl https://<your-domain>/api/health`
- **Login**:
  POST to `https://<your-domain>/api/auth/login` with admin credentials.
- **Search**:
  Visit `https://<your-domain>/api/content/search?q=test`
- **Frontend**:
  Visit `https://<your-domain>/`. It should load the React app (from `client_build`).
- **File Uploads**:
  Verify `/uploads` directory exists and is writable:
  ```bash
  mkdir -p uploads
  chmod 755 uploads
  ```

## 8. Troubleshooting
- **503 Errors**: Check if `npm install` completed successfully and if the database credentials are correct.
- **Backup**: Always snapshot your DB before running migrations on a live system.
