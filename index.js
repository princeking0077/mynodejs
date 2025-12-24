const http = require('http');
const fs = require('fs');
const path = require('path');

// LOG STARTUP
fs.writeFileSync(path.join(__dirname, 'crash_report.txt'), 'STARTING HELLO WORLD SERVER\n');

try {
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello World - Node is Working');
    });

    server.listen(3000, () => {
        fs.appendFileSync(path.join(__dirname, 'crash_report.txt'), 'SERVER LISTENING ON 3000\n');
        console.log('Server listening on 3000');
    });
} catch (e) {
    fs.appendFileSync(path.join(__dirname, 'crash_report.txt'), 'CRASH: ' + e.message + '\n');
}
