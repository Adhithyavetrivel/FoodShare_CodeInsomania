// app.js
// Main entry point for our Express server.
// This file sets up middleware and connects our routes.

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import database connection (also runs the connection test)
const db = require('./database/db');

// Create the Express app
const app = express();

// ============================================
// Middleware
// ============================================

// Allow requests from our frontend (running on a different port/file)
// credentials: true lets cookies be sent along with requests
app.use(cors({
    origin: 'http://localhost:5500', // Live Server default port for frontend
    credentials: true
}));

// Parse incoming JSON request bodies (e.g., form data sent as JSON)
app.use(express.json());

// Parse cookies attached to incoming requests (used for JWT auth)
app.use(cookieParser());

// ============================================
// Test Route
// Just to confirm server is working
// ============================================
app.get('/', (req, res) => {
    res.send('🍲 FoodShare API is running!');
});

// ============================================
// Test DB Route
// Confirms Express can query the database
// ============================================
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        res.json({ message: 'Database query successful!', data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Database query failed', error: error.message });
    }
});

// ============================================
// Routes will be added here in later steps
 app.use('/api/auth', require('./routes/authRoutes'));
 app.use('/api/donations', require('./routes/donationRoutes'));
// ============================================

// ============================================
// Start the Server
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
