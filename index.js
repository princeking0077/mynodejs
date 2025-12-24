// Hostinger Entry Point (Bridge)
const fs = require('fs');
const path = require('path');

console.log('--- BOOTSTRAP: Hostinger Entry Point ---');

// AUTO-CLEANUP: Remove conflicting server/node_modules if present
// This fixes the "503 Crash" caused by stale dependencies
try {
    const stalePath = path.join(__dirname, 'server', 'node_modules');
    if (fs.existsSync(stalePath)) {
        console.log('[Fix] Removing stale server/node_modules...');
        fs.rmSync(stalePath, { recursive: true, force: true });
        console.log('[Fix] Cleanup Complete.');
    }
} catch (e) {
    console.error('[Warning] Cleanup failed:', e.message);
}

require('./server/index.js');
