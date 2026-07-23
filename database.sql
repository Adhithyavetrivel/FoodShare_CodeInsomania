-- ============================================
-- FoodShare Database Setup
-- Community Food Donation Platform
-- ============================================

-- Create the database
CREATE DATABASE IF NOT EXISTS foodshare_db;

-- Select the database to use
USE foodshare_db;

-- ============================================
-- Table 1: Users
-- Stores donors, receivers, and admin
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('donor', 'receiver', 'admin') DEFAULT 'donor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table 2: Donations
-- Stores food donation posts
-- ============================================
CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    food_name VARCHAR(100) NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    pickup_address VARCHAR(255) NOT NULL,
    status ENUM('available', 'requested', 'completed') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- Table 3: Requests
-- Stores requests made by receivers for a donation
-- ============================================
CREATE TABLE IF NOT EXISTS requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT NOT NULL,
    receiver_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- Optional: Insert a default admin user for testing
-- Password below is plain text here just as a placeholder.
-- We will create a REAL admin using bcrypt-hashed password
-- later through the app itself (Step 6), so you can skip
-- running this INSERT if you prefer.
-- ============================================
-- INSERT INTO users (name, email, password, phone, role)
-- VALUES ('Admin', 'admin@foodshare.com', 'REPLACE_WITH_HASHED_PASSWORD', '9999999999', 'admin');