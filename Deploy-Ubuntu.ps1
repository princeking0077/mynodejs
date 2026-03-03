# LearnPharmacy - PowerShell Deployment Script for Ubuntu
# Run this in PowerShell to deploy to your Ubuntu server

$ErrorActionPreference = "Stop"

$SERVER = "187.77.191.122"
$USERNAME = "root"
$PASSWORD = "SHoaib@#001001"
$DEPLOY_SCRIPT = "ubuntu-deploy.sh"

Write-Host "=========================================" -ForegroundColor Blue
Write-Host "  LearnPharmacy - Ubuntu Deployment" -ForegroundColor Blue
Write-Host "=========================================" -ForegroundColor Blue
Write-Host ""

# Step 1: Upload deployment script
Write-Host "[1/3] Uploading deployment script to server..." -ForegroundColor Yellow
try {
    # Using pscp (PuTTY SCP) if available, otherwise provide manual instructions
    if (Get-Command pscp -ErrorAction SilentlyContinue) {
        echo y | pscp -pw $PASSWORD $DEPLOY_SCRIPT ${USERNAME}@${SERVER}:/root/
        Write-Host "SUCCESS: Deployment script uploaded" -ForegroundColor Green
    } else {
        Write-Host "PSCP not found. Please install PuTTY or use manual method:" -ForegroundColor Red
        Write-Host "Run: scp ubuntu-deploy.sh root@187.77.191.122:/root/" -ForegroundColor Yellow
        Write-Host "Password: SHoaib@#001001" -ForegroundColor Yellow
        Read-Host "Press Enter after uploading the script"
    }
} catch {
    Write-Host "Upload failed. Trying alternative method..." -ForegroundColor Yellow
}

Write-Host ""

# Step 2: Make executable and run
Write-Host "[2/3] Connecting to server and starting deployment..." -ForegroundColor Yellow
Write-Host "NOTE: The deployment will take 10-15 minutes" -ForegroundColor Cyan
Write-Host ""

# Create SSH command file
$sshCommands = @"
chmod +x /root/ubuntu-deploy.sh
bash /root/ubuntu-deploy.sh
"@

# If plink is available
if (Get-Command plink -ErrorAction SilentlyContinue) {
    echo y | plink -pw $PASSWORD ${USERNAME}@${SERVER} "chmod +x /root/ubuntu-deploy.sh && bash /root/ubuntu-deploy.sh"
} else {
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host "  Manual Deployment Steps" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Open a separate terminal/PowerShell window" -ForegroundColor White
    Write-Host "2. Run: ssh root@187.77.191.122" -ForegroundColor Yellow
    Write-Host "3. Enter password: SHoaib@#001001" -ForegroundColor Yellow
    Write-Host "4. Run these commands:" -ForegroundColor White
    Write-Host ""
    Write-Host "   chmod +x /root/ubuntu-deploy.sh" -ForegroundColor Green
    Write-Host "   bash /root/ubuntu-deploy.sh" -ForegroundColor Green
    Write-Host ""
    Write-Host "The script will:" -ForegroundColor White
    Write-Host "  • Install Node.js, MySQL, PM2, Nginx" -ForegroundColor Gray
    Write-Host "  • Clone and build your application" -ForegroundColor Gray
    Write-Host "  • Configure database and create admin user" -ForegroundColor Gray
    Write-Host "  • Set up SSL certificates" -ForegroundColor Gray
    Write-Host "  • Start the application" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  Deployment Process Started" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to exit"
