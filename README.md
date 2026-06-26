# NexaChain AI - MERN Stack Investment & Referral Platform

A full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** application built for the **NexaChain AI Developer Technical Assessment**.

The platform allows users to:

- Register & Login securely
- Create and manage investments
- Earn Daily ROI automatically
- Generate referral income through a multi-level referral system
- Monitor earnings and referrals from a modern dashboard

---

## Features

### Secure Authentication

- JWT-based Authentication
- User Registration & Login
- Rate Limiting
- Request Validation using `express-validator`

### Investment Management

- Create investments
- Track active investments
- View investment history

### Automated Daily ROI Distribution

- Daily ROI calculated using `node-cron`
- Runs automatically every midnight
- MongoDB ACID Transactions
- Strict Idempotency to prevent duplicate credits

### Multi-Level Referral System

Automatic referral commission distribution:

| Level | Commission |
|--------|------------|
| Level 1 | 5% |
| Level 2 | 3% |
| Level 3 | 1% |

### Interactive Dashboard

- Wallet Balance
- Total Investments
- ROI Earnings
- Referral Income
- Earnings Charts (Recharts)
- Recursive Referral Tree Visualization

---

# Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- Recharts

## Backend

- Node.js
- Express.js
- JWT Authentication
- Express Validator
- Node Cron

## Database

- MongoDB
- Mongoose

---

# Project Structure

```text
NexaChain-AI/
│
├── backend/
│   ├── configs/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── .env
│
├── postman_collection.json
└── README.md
```

---

# Environment Variables

## Backend (`/backend/.env`)

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
FRONTEND_URI=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=30d
```

---

## Frontend (`/frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

---

# Installation

## Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/nexachain-ai.git

cd nexachain-ai
```

---

## 2️⃣ Backend Setup

```bash
cd backend

npm install

npm start
```

Backend runs at:

```
http://localhost:5000
```

The Daily ROI Cron Scheduler starts automatically.

---

## 3️⃣ Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# API Documentation

All APIs are prefixed with:

```
/api
```

Protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication APIs

| Method | Endpoint | Description | Access |
|---------|----------|-------------|--------|
| POST | `/auth/register` | Register new user (supports `referredByCode`) | Public |
| POST | `/auth/login` | Login and receive JWT | Public |
| GET | `/auth/me` | Get current user | Private |

---

## Investment APIs

| Method | Endpoint | Description | Access |
|---------|----------|-------------|--------|
| POST | `/investments` | Create Investment | Private |
| GET | `/investments` | Investment History | Private |
| GET | `/dashboard` | Dashboard Summary | Private |

---

## Referral APIs

| Method | Endpoint | Description | Access |
|---------|----------|-------------|--------|
| GET | `/referrals/direct` | Direct Referrals | Private |
| GET | `/referrals/tree` | Nested Referral Tree | Private |
| GET | `/referrals/history` | Referral Income History | Private |

---

## ROI APIs

| Method | Endpoint | Description | Access |
|---------|----------|-------------|--------|
| GET | `/roi` | Daily ROI History | Private |

---

# Daily ROI Scheduler

The application includes an automated scheduler using **node-cron**.

It:

- Executes every day at **12:00 AM**
- Calculates ROI
- Credits user wallets
- Creates ROI history
- Uses MongoDB transactions
- Prevents duplicate processing

---

# Security Features

- JWT Authentication
- Password Hashing
- Rate Limiting
- Request Validation
- MongoDB Transactions
- Idempotent Cron Jobs
- Protected Routes

---

# Assumptions

### Referral Levels

Referral commissions are distributed up to **3 levels**.

| Level | Commission |
|--------|------------|
| Level 1 | 5% |
| Level 2 | 3% |
| Level 3 | 1% |

These values can be changed easily through the `LEVEL_PERCENTAGES` constant.

---

### Cron Job Idempotency

To prevent duplicate ROI crediting:

**Application Level**

- Checks the `RoiHistory` collection before processing.

**Database Level**

- Uses a compound unique index on:

```
investment + date
```

---

### Timezone

The scheduler runs every day at:

```
12:00 AM
Asia/Kolkata
```

---

### Funding

Creating an investment assumes:

- External payment gateway integration
- OR admin approval

For this MVP, investments become active immediately after creation.

---

### Data Deletion

Instead of permanently deleting users, the application uses:

```
accountStatus = "Inactive"
```

This preserves:

- Referral hierarchy
- Financial history
- ROI records

---

<!-- # 📌 Future Improvements

- 💳 Payment Gateway Integration
- 📱 Mobile Responsive Enhancements
- 🔔 Email Notifications
- 📧 Password Reset
- 📈 Admin Dashboard
- 📊 Advanced Analytics
- 📥 Investment Withdrawal Requests
- 🌐 Docker Deployment
- ☁️ CI/CD Pipeline -->

---

# Author

Developed as part of the **NexaChain AI Developer Technical Assessment**.

---