# FoodShare – Community Food Donation Platform

A simple web application that connects people who have surplus food
with people who need it, helping reduce food wastage in the community.

## 📌 Project Overview

FoodShare allows registered users to either **donate** surplus food or
**request** available donations. An admin can oversee all users,
donations, and requests on the platform.

This project was built as a second-year Computer Science semester project.

## 🛠️ Technology Stack

- **Frontend:** HTML, CSS, JavaScript, Bootstrap 5
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens) stored in httpOnly cookies
- **Password Security:** bcrypt.js for password hashing

## ✨ Features

1. User Registration (Donor / Receiver)
2. User Login (JWT-based authentication)
3. Home Page
4. Add Food Donation (Donor)
5. View All Donations (Public browsing)
6. Request a Donation (Receiver)
7. View My Donations (Dashboard)
8. Admin Panel (View all Users, Donations, Requests)

## 📁 Project Structure

```text
FoodShare/
│
├── client/
│   ├── css/
│   │   └── style.css
│   │
│   ├── images/
│   │
│   ├── js/
│   │   ├── auth-guard.js
│   │   ├── admin.js
│   │   ├── donations.js
│   │   ├── login.js
│   │   ├── my-donations.js
│   │   ├── navbar.js
│   │   ├── register.js
│   │   └── request.js
│   │
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── add-donation.html
│   ├── donations.html
│   ├── my-donations.html
│   ├── requests.html
│   └── admin.html
│
├── server/
│   ├── database/
│   │   └── db.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── donationRoutes.js
│   │   ├── requestRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── app.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── .gitignore
│
├── database.sql
├── README.md
└── .gitignore
```

## 🗄️ Database Schema

**users** — id, name, email, password (hashed), phone, role (donor/receiver/admin)

**donations** — id, donor_id, food_name, quantity, expiry_date, pickup_address, status (available/requested/completed)

**requests** — id, donation_id, receiver_id, status (pending/approved/rejected)

## 🚀 How to Run This Project

### Prerequisites
- Node.js installed
- MySQL Server installed and running

### Setup Steps

1. **Set up the database:**
```bash
   mysql -u root -p
   SOURCE path/to/FoodShare/database.sql;
```

2. **Configure environment variables:**
   Open `server/.env` and set your MySQL password:

   3. **Install backend dependencies:**
```bash
   cd server
   npm install
```
DB_PASSWORD=your_mysql_password

4. **Start the backend server:**
```bash
   npm run dev
```
   Server runs on `http://localhost:5000`

5. **Run the frontend:**
   Open `client/index.html` using VS Code's **Live Server** extension
   (make sure it's set to use `localhost`, not `127.0.0.1`).
   Frontend runs on `http://localhost:5500`

### Creating an Admin Account

Since admin accounts aren't created through the UI (for security),
register a normal account first, then run this SQL command:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

Log out and log back in afterward so the new role takes effect.

## 🔒 Security Notes

- Passwords are hashed using bcrypt before being stored — never saved as plain text.
- JWT tokens are stored in httpOnly cookies, protecting them from JavaScript-based attacks.
- Backend middleware (`verifyToken`, `verifyAdmin`) protects all sensitive routes,
  independent of any frontend checks — frontend checks only improve user experience.

## 👤 Author

Adhithya — B.E Computer Science (Cybersecurity) 

