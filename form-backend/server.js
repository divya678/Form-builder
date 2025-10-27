import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import formRoutes from "./routes/formroutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import configRoutes from "./routes/configRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/forms", formRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/site-config", configRoutes);

const mongoUrl = process.env.MONGO_URI;

if (!mongoUrl) {
    throw new Error("❌ MONGO_URI is not defined in .env file");
}

// MongoDB connection
mongoose
    .connect(mongoUrl)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection failed:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

