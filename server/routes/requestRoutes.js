// requestRoutes.js
// Handles a receiver requesting a donation.

const express = require('express');
const router = express.Router();
const db = require('../database/db');
const verifyToken = require('./authMiddleware');

// ============================================
// ROUTE 1: Request a donation
// POST /api/requests
// Body: { donation_id }
// ============================================
router.post('/', verifyToken, async (req, res) => {
    try {
        const { donation_id } = req.body;
        const receiver_id = req.user.id;

        if (!donation_id) {
            return res.status(400).json({ message: 'Donation ID is required.' });
        }

        // Check that the donation exists and is still available
        const [donationRows] = await db.query(
            'SELECT * FROM donations WHERE id = ?',
            [donation_id]
        );

        if (donationRows.length === 0) {
            return res.status(404).json({ message: 'Donation not found.' });
        }

        const donation = donationRows[0];

        if (donation.status !== 'available') {
            return res.status(400).json({ message: 'This donation is no longer available.' });
        }

        // Prevent donors from requesting their own donation
        if (donation.donor_id === receiver_id) {
            return res.status(400).json({ message: 'You cannot request your own donation.' });
        }

        // Check if this user already requested this donation
        const [existingRequest] = await db.query(
            'SELECT * FROM requests WHERE donation_id = ? AND receiver_id = ?',
            [donation_id, receiver_id]
        );

        if (existingRequest.length > 0) {
            return res.status(400).json({ message: 'You have already requested this donation.' });
        }

        // Insert the new request
        await db.query(
            'INSERT INTO requests (donation_id, receiver_id, status) VALUES (?, ?, ?)',
            [donation_id, receiver_id, 'pending']
        );

        // Mark the donation as "requested" so others can't request it too
        await db.query(
            'UPDATE donations SET status = ? WHERE id = ?',
            ['requested', donation_id]
        );

        res.status(201).json({ message: 'Request sent successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while requesting donation.', error: error.message });
    }
});

// ============================================
// ROUTE 2: Get requests made BY the logged-in user
// GET /api/requests/my
// (Useful if you want to show "My Requests" later; not required by
// the assignment but harmless to include for completeness)
// ============================================
router.get('/my', verifyToken, async (req, res) => {
    try {
        const receiver_id = req.user.id;

        const [requests] = await db.query(
            `SELECT requests.id, requests.status, requests.created_at,
                    donations.food_name, donations.quantity, donations.pickup_address
             FROM requests
             JOIN donations ON requests.donation_id = donations.id
             WHERE requests.receiver_id = ?
             ORDER BY requests.created_at DESC`,
            [receiver_id]
        );

        res.status(200).json({ requests });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching your requests.', error: error.message });
    }
});

module.exports = router;