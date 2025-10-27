import express from "express";
import { getDashboardStats, getFormActivity } from "../controllers/dashController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/activity", getFormActivity);

export default router;
