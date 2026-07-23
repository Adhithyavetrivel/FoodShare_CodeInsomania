// authRoutes.js
// Handles user registration and login.

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
require('dotenv').config();

// ============================================
// ROUTE 1: Register a new user
// POST /api/auth/register
// ============================================
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        // Check if email already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        // Hash the password before saving (never store plain text passwords!)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        // role defaults to 'donor' if not provided
        await db.query(
            'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone || null, role || 'donor']
        );

        res.status(201).json({ message: 'Registration successful! Please login.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
});

// ============================================
// ROUTE 2: Login existing user
// POST /api/auth/login
// ============================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Find user by email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const user = users[0];

        // Compare entered password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Create JWT token containing user id, name, and role
        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } // token valid for 2 hours
        );

        // Store token in a cookie (httpOnly = JS on frontend cannot read it, safer)
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
        });

        // Send back basic user info (without password) so frontend can display name/role
        res.status(200).json({
            message: 'Login successful!',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
});

// ============================================
// ROUTE 3: Logout
// POST /api/auth/logout
// ============================================
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully.' });
});

// ============================================
// ROUTE 4: Get current logged-in user info
// GET /api/auth/me
// Used by frontend to check "am I logged in?" on page load
// ============================================
router.get('/me', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Not logged in.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ user: decoded });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
});

module.exports = router;
