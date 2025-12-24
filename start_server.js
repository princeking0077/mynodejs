const fs = require('fs');
const path = require('path');

console.log('--- BOOTSTRAP: Starting Safe Server Launch ---');

// 1. Clean up stale server/node_modules if it exists
// This causes conflicts because the server tries to load broken modules from here
// instead of the healthy root node_modules.
const staleModulesPath = path.join(__dirname, 'server', 'node_modules');
const stalePackageLock = path.join(__dirname, 'server', 'package-lock.json');
const stalePackageJson = path.join(__dirname, 'server', 'package.json');

const cleanup = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            console.log(`Cleaning up stale file/dir: ${filePath}`);
            fs.rmSync(filePath, { recursive: true, force: true });
        }
    } catch (err) {
        console.error(`Warning: Failed to clean ${filePath}: ${err.message}`);
    }
};

cleanup(staleModulesPath);
cleanup(stalePackageLock);
cleanup(stalePackageJson);

console.log('--- BOOTSTRAP: Cleanup Complete. Launching Server ---');

// 2. Start the actual server
try {
    require('./server/index.js');
} catch (err) {
    console.error('CRITICAL: Failed to start server/index.js');
    console.error(err);
    process.exit(1);
}
