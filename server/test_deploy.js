const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const path = require('path');

// HARDCODED CREDENTIALS FOR VERIFICATION
const dbConfig = {
    host: '127.0.0.1',
    user: 'u480091743_shoaib',
    password: 'Shaikh@001001',
    database: 'u480091743_pharmacy',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

app.get('/test-db', async (req, res) => {
    try {
        const pool = mysql.createPool(dbConfig);
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT 1 as val');
        connection.release();
        res.status(200).json({
            status: 'success',
            message: 'Connected to Database Successfully!',
            val: rows[0].val,
            config_used: { ...dbConfig, password: '***' } // Don't expose pass
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            code: error.code,
            config_used: { ...dbConfig, password: '***' }
        });
    }
});

app.get('/test-fs', (req, res) => {
    const fs = require('fs');
    const distPath = path.join(__dirname, '../client/dist');
    const files = fs.existsSync(distPath) ? fs.readdirSync(distPath) : ['Not Found'];
    res.json({
        cwd: process.cwd(),
        dirname: __dirname,
        distPath: distPath,
        files: files
    });
});

const PORT = 3001; // Separate port to not conflict if main is running, or just run this
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});
