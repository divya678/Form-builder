import express from "express";
import {
    createForm,
    getForms,
    getFormById,
    updateForm,
    deleteForm,
    duplicateForm,
} from "../controllers/formController.js";

const router = express.Router();

router.post("/", createForm);
router.get("/", getForms);
router.get("/:id", getFormById);
router.put("/:id", updateForm);
router.delete("/:id", deleteForm);
router.post("/:id/duplicate", duplicateForm);

export default router;
