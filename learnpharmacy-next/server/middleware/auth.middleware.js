const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // FALLBACK SECRET applied
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_123456';
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
