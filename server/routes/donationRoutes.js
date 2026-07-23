// donationRoutes.js
// Handles creating donations and fetching donation lists.

const express = require('express');
const router = express.Router();
const db = require('../database/db');
const verifyToken = require('./authMiddleware');

// ============================================
// ROUTE 1: Add a new donation (Donor only, must be logged in)
// POST /api/donations
// ============================================
router.post('/', verifyToken, async (req, res) => {
    try {
        const { food_name, quantity, expiry_date, pickup_address } = req.body;
        const donor_id = req.user.id; // comes from JWT token, not the request body (safer)

        if (!food_name || !quantity || !expiry_date || !pickup_address) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        await db.query(
            `INSERT INTO donations (donor_id, food_name, quantity, expiry_date, pickup_address, status)
             VALUES (?, ?, ?, ?, ?, 'available')`,
            [donor_id, food_name, quantity, expiry_date, pickup_address]
        );

        res.status(201).json({ message: 'Donation added successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while adding donation.', error: error.message });
    }
});

// ============================================
// ROUTE 2: Get ALL donations (for the "View All Donations" page)
// GET /api/donations
// Only shows donations that are still 'available' (not yet completed)
// Joins with users table to show donor name
// ============================================
router.get('/', async (req, res) => {
    try {
        const [donations] = await db.query(
            `SELECT donations.id, donations.food_name, donations.quantity, 
                    donations.expiry_date, donations.pickup_address, donations.status,
                    users.name AS donor_name
             FROM donations
             JOIN users ON donations.donor_id = users.id
             ORDER BY donations.created_at DESC`
        );

        res.status(200).json({ donations });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching donations.', error: error.message });
    }
});

// ============================================
// ROUTE 3: Get donations posted by the LOGGED-IN user ("My Donations")
// GET /api/donations/my
// ============================================
router.get('/my', verifyToken, async (req, res) => {
    try {
        const donor_id = req.user.id;

        const [donations] = await db.query(
            `SELECT id, food_name, quantity, expiry_date, pickup_address, status
             FROM donations
             WHERE donor_id = ?
             ORDER BY created_at DESC`,
            [donor_id]
        );

        res.status(200).json({ donations });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching your donations.', error: error.message });
    }
});

module.exports = router;
