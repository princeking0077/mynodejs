const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');
const authenticateToken = require('../middleware/auth.middleware');

// POST /api/build/rebuild - Trigger site rebuild
router.post('/rebuild', authenticateToken, (req, res) => {
    const buildPath = path.join(__dirname, '../../');
    
    // Run npm run build in the background
    exec('npm run build', { cwd: buildPath }, (error, stdout, stderr) => {
        if (error) {
            console.error('Build error:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Build failed', 
                error: error.message 
            });
        }
        
        // Restart PM2 after successful build
        exec('pm2 restart learnpharmacy', (restartError) => {
            if (restartError) {
                console.error('PM2 restart error:', restartError);
            }
        });
        
        res.json({ 
            success: true, 
            message: 'Site rebuild started. Changes will be live in 30-60 seconds.' 
        });
    });
});

module.exports = router;
