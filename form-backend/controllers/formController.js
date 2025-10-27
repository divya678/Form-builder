import Form from "../models/form.js";
import Activity from "../models/activity.js";

// Create a new form
export const createForm = async (req, res) => {
    try {
        const form = await Form.create(req.body);
        await Activity.create({ action: "Created new form", formName: form.name });
        res.status(201).json(form);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all forms
export const getForms = async (req, res) => {
    try {
        const forms = await Form.find().sort({ updatedAt: -1 });
        res.json(forms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single form
export const getFormById = async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        res.json(form);
    } catch (err) {
        res.status(404).json({ message: "Form not found" });
    }
};

// Update form
export const updateForm = async (req, res) => {
    try {
        const form = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
        await Activity.create({ action: "Edited form", formName: form?.name });
        res.json(form);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete form
export const deleteForm = async (req, res) => {
    try {
        const form = await Form.findByIdAndDelete(req.params.id);
        await Activity.create({ action: "Deleted form", formName: form?.name });
        res.json({ message: "Form deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Duplicate form
export const duplicateForm = async (req, res) => {
    try {
        const original = await Form.findById(req.params.id);
        const copy = await Form.create({
            name: original?.name + " Copy",
            fields: original?.fields,
            status: "draft",
        });
        await Activity.create({ action: "Duplicated form", formName: copy.name });
        res.status(201).json(copy);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
