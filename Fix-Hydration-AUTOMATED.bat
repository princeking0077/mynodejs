@echo off
setlocal enabledelayedexpansion

echo ---------------------------------------------------------
echo LearnPharmacy - AUTOMATED HYDRATION FIX ^& CLEANUP
echo ---------------------------------------------------------
echo.

:: Configuration
set HOST=187.77.191.122
set USER=learnpharmacy
set REMOTE_ROOT=/home/learnpharmacy/htdocs/www.learnpharmacy.in/learnpharmacy-next
set LOCAL_ROOT=learnpharmacy-next

echo [1/3] Please enter your SSH Password:
echo (Try Shoaib@#001001 or Suhana@001001)
set /p PASS=Password: 

echo.
echo [2/3] Uploading cleaned files to server...
echo.

pscp -pw "%PASS%" "%LOCAL_ROOT%\src\styles\admin.css" %USER%@%HOST%:%REMOTE_ROOT%/src/styles/admin.css
pscp -pw "%PASS%" "%LOCAL_ROOT%\src\pages\_document.js" %USER%@%HOST%:%REMOTE_ROOT%/src/pages/_document.js
pscp -pw "%PASS%" "%LOCAL_ROOT%\src\components\AdminLayout.jsx" %USER%@%HOST%:%REMOTE_ROOT%/src/components/AdminLayout.jsx

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Upload failed. Please check your password.
    pause
    exit /b
)

echo.
echo [3/3] Performing DEEP CLEAN and REBUILD on server...
echo This will take 1-2 minutes.
echo.

plink -batch -pw "%PASS%" %USER%@%HOST% "cd %REMOTE_ROOT% && rm -rf .next node_modules package-lock.json && npm install && npm run build && pm2 restart learnpharmacy-prod"

echo.
echo ---------------------------------------------------------
echo SUCCESS! Hydration fix has been deployed and rebuilt.
echo 1. Clear your browser cache for the last hour.
echo 2. Refresh (Ctrl+F5) your website.
echo ---------------------------------------------------------
pause
