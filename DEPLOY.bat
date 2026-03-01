@echo off
:: LearnPharmacy Quick Deployment Script for Windows
:: Run this to build and create deployment package

echo ========================================
echo LearnPharmacy Deployment Builder
echo ========================================
echo.

:: Step 1: Build Next.js
echo [1/3] Building Next.js application...
cd learnpharmacy-next
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo SUCCESS: Build completed
echo.

:: Step 2: Create deployment package
echo [2/3] Creating deployment package...
cd ..
tar -czf "learnpharmacy-deployment.tar.gz" --exclude="node_modules" --exclude=".git" --exclude=".next/cache" --exclude="*.log" "learnpharmacy-next"
if %errorlevel% neq 0 (
    echo ERROR: Package creation failed!
    pause
    exit /b 1
)
echo SUCCESS: Deployment package created
echo.

:: Step 3: Show completion
echo [3/3] Deployment package ready!
echo ========================================
echo.
echo Package: learnpharmacy-deployment.tar.gz
for %%I in ("learnpharmacy-deployment.tar.gz") do echo Size: %%~zI bytes
echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo.
echo 1. Upload learnpharmacy-deployment.tar.gz to your VPS
echo.
echo 2. SSH into your VPS and run:
echo    cd /var/www
echo    tar -xzf learnpharmacy-deployment.tar.gz
echo    cd learnpharmacy-next
echo    npm install --production
echo    pm2 restart learnpharmacy
echo.
echo 3. Verify deployment:
echo    pm2 logs
echo    pm2 status
echo.
echo ========================================
echo.
pause
