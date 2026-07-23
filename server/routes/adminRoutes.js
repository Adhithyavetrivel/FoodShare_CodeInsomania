// adminRoutes.js
// Routes only an admin can access — view all users and all donations.

const express = require('express');
const router = express.Router();
const db = require('../database/db');
const verifyToken = require('./authMiddleware');
const verifyAdmin = require('./adminMiddleware');

// ============================================
// ROUTE 1: Get all users (excluding passwords)
// GET /api/admin/users
// ============================================
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC`
        );
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching users.', error: error.message });
    }
});

// ============================================
// ROUTE 2: Get all donations (with donor name)
// GET /api/admin/donations
// ============================================
router.get('/donations', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const [donations] = await db.query(
            `SELECT donations.id, donations.food_name, donations.quantity,
                    donations.expiry_date, donations.pickup_address, donations.status,
                    users.name AS donor_name, users.email AS donor_email
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
// ROUTE 3: Get all requests (bonus - helpful for admin overview)
// GET /api/admin/requests
// ============================================
router.get('/requests', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const [requests] = await db.query(
            `SELECT requests.id, requests.status, requests.created_at,
                    donations.food_name, 
                    donor.name AS donor_name,
                    receiver.name AS receiver_name
             FROM requests
             JOIN donations ON requests.donation_id = donations.id
             JOIN users AS donor ON donations.donor_id = donor.id
             JOIN users AS receiver ON requests.receiver_id = receiver.id
             ORDER BY requests.created_at DESC`
        );
        res.status(200).json({ requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching requests.', error: error.message });
    }
});

module.exports = router;
