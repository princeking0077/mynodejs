const fs = require('fs');
const path = require('path');

const log = (msg) => {
    try {
        fs.appendFileSync(path.join(__dirname, 'crash_report.txt'), msg + '\n');
        console.log(msg);
    } catch (e) { }
};

log('--- TESTING MODULES ---');

try {
    log('Loading path...');
    require('path');
    log('✅ path loaded');

    log('Loading fs...');
    require('fs');
    log('✅ fs loaded');

    log('Loading express...');
    require('express');
    log('✅ express loaded');

    log('Loading mysql2...');
    require('mysql2');
    log('✅ mysql2 loaded');

    log('Loading dotenv...');
    require('dotenv');
    log('✅ dotenv loaded');

    log('Loading cors...');
    require('cors');
    log('✅ cors loaded');

    log('🎉 ALL MODULES OK');

    // Start a dummy server to keep the process alive so user sees "503" gone ??
    // Or just exit so we can see the log.
    // Hostinger expects a server.
    const http = require('http');
    http.createServer((req, res) => res.end('Modules OK')).listen(3000, () => log('Server listening'));

} catch (e) {
    log('❌ CRASH LOADING MODULES: ' + e.message);
    log(e.stack);
}
