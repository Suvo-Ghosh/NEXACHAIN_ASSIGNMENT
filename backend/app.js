import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./configs/connectDB.js";

import authRoutes from "./routes/authRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import roiRoutes from "./routes/roiRoutes.js";

import { startCronJobs } from './services/cronService.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
    origin: process.env.FRONTEND_URI || "http://localhost:5173",
    credentials: true, // Optional: useful if you plan on sending cookies later
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Add this to app.js
app.get("/api/health", (req, res) => res.status(200).send("Server is awake!"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/referrals", referralRoutes);
app.use('/api/roi', roiRoutes);

const PORT = process.env.PORT || 4000;

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        // Initialize the Cron Scheduler after the DB connection is successful
        startCronJobs();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();