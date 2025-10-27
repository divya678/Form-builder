import express from "express";
import { getSMTPConfig, updateSMTPConfig } from "../controllers/configController.js";

const router = express.Router();

router.get("/smtp", getSMTPConfig);
router.put("/smtp", updateSMTPConfig);

export default router;
