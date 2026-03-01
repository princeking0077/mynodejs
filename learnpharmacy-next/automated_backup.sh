#!/bin/bash
# automated_backup.sh - Configure this in Hostinger CyberPanel Cron Jobs
# Run daily at 2AM: 0 2 * * * /path/to/automated_backup.sh

# Environment Variables (ensure these match your production env)
DB_USER="pharma"
DB_PASS="Suhana@001001"
DB_NAME="learnpharmacy"

BACKUP_DIR="/var/www/learnpharmacy.in/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
FILE_NAME="$BACKUP_DIR/$DB_NAME-$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform DB Dump
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $FILE_NAME

# Compress Dump
gzip $FILE_NAME

# Keep only the last 7 days of backups to prevent disk bloat
find $BACKUP_DIR/* -mtime +7 -exec rm {} \;

echo "Database Backup Successfully created at $FILE_NAME.gz"
