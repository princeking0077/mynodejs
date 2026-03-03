@echo off
:: LearnPharmacy - Deploy to Ubuntu Server
:: This script uploads and executes the deployment on your Ubuntu server

echo ========================================
echo   LearnPharmacy - Ubuntu Deployment
echo ========================================
echo.

set SERVER=root@187.77.191.122
set DEPLOY_SCRIPT=ubuntu-deploy.sh

echo [1/3] Uploading deployment script to server...
scp %DEPLOY_SCRIPT% %SERVER%:/root/ubuntu-deploy.sh
if %errorlevel% neq 0 (
    echo ERROR: Failed to upload deployment script
    echo.
    echo Please run this command manually:
    echo scp ubuntu-deploy.sh root@187.77.191.122:/root/
    pause
    exit /b 1
)
echo SUCCESS: Deployment script uploaded
echo.

echo [2/3] Making script executable...
ssh %SERVER% "chmod +x /root/ubuntu-deploy.sh"
echo.

echo [3/3] Running deployment script on server...
echo NOTE: This will take 10-15 minutes. Please wait...
echo.
ssh %SERVER% "bash /root/ubuntu-deploy.sh"

echo.
echo ========================================
echo   Deployment Script Execution Started
echo ========================================
echo.
echo The deployment is now running on the server.
echo It will install: Node.js, MySQL, PM2, Nginx, SSL
echo.
pause
