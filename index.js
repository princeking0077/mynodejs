const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// LOGGING
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

// ROOT ROUTE
app.get('/', (req, res) => {
    res.send('SERVER IS WORKING (v3 Minimal)');
});

// PING ROUTE
app.get('/api/ping', (req, res) => {
    res.json({ message: "PONG", time: new Date().toISOString() });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`MINIMAL SERVER running on port ${PORT}`);
});
