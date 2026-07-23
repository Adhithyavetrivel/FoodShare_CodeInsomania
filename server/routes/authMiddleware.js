// authMiddleware.js
// This function checks if a user is logged in by verifying their JWT token.
// We'll use this to protect routes like "Add Donation" or "My Donations".

const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
    // Token is stored in a cookie named "token"
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token found. Please login.' });
    }

    try {
        // Verify token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info (id, role) to request
        next(); // move to the next function (the actual route)
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
    }
}

module.exports = verifyToken;