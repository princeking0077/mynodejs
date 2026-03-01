const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server/.env') });

const resetPassword = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'learnpharmacy'
        });

        const emails = ['shoaib.ss300@gmail.com', 'admin@learnpharmacy.in'];
        const rawPassword = 'Shoaib@#001001';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        for (const email of emails) {
            console.log('Updating password for:', email);
            const [result] = await connection.execute(
                'UPDATE users SET password = ?, role = ? WHERE email = ?',
                [hashedPassword, 'admin', email]
            );

            if (result.affectedRows === 0) {
                console.log('Creating user:', email);
                await connection.execute(
                    'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                    ['Admin', email, hashedPassword, 'admin']
                );
            }
        }

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error reset:', error);
        process.exit(1);
    }
};

resetPassword();
