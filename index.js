const fs = require('fs');
const path = require('path');

console.log('--- BOOTSTRAP: Hostinger Entry Point ---');

const logCrash = (type, err) => {
    const report = `
    TIME: ${new Date().toISOString()}
    TYPE: ${type}
    MESSAGE: ${err.message || err}
    STACK: ${err.stack || 'No stack trace'}
    \n`;
    try {
        fs.appendFileSync(path.join(__dirname, 'crash_report.txt'), report);
    } catch (fsErr) {
        console.error('Failed to write crash report:', fsErr);
    }
};

// AUTO-CLEANUP: Remove conflicting server/node_modules if present
try {
    const stalePath = path.join(__dirname, 'server', 'node_modules');
    if (fs.existsSync(stalePath)) {
        console.log('[Fix] Removing stale server/node_modules...');
        fs.rmSync(stalePath, { recursive: true, force: true });
        console.log('[Fix] Cleanup Complete.');
    }
} catch (e) {
    console.error('[Warning] Cleanup failed:', e.message);
    logCrash('CLEANUP_ERROR', e);
}

// START SERVER
try {
    require('./server/index.js');
} catch (err) {
    console.error('Failed to start server:', err);
    logCrash('STARTUP_ERROR', err);
    process.exit(1);
}

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
    logCrash('UNCAUGHT_EXCEPTION', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
    logCrash('UNHANDLED_REJECTION', reason);
});
