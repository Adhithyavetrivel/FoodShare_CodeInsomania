// db.js
// This file creates a connection pool to our MySQL database.
// A "pool" lets multiple queries run without opening a new
// connection every single time — better for performance.

const mysql = require('mysql2');
require('dotenv').config(); // Load variables from .env file

// Create a connection pool using credentials from .env
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // max simultaneous connections
    queueLimit: 0
});

// Convert pool to use Promises so we can use async/await
// instead of callback functions (easier to read and write)
const promisePool = pool.promise();

// Quick test to check if connection works when server starts
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Database connected successfully!');
        connection.release(); // release connection back to pool
    }
});

module.exports = promisePool;