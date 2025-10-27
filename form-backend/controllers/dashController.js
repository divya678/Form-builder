import Form from "../models/form.js";

export const getDashboardStats = async (req, res) => {
    try {
        const totalForms = await Form.countDocuments();
        const activeForms = await Form.countDocuments({ status: "active" });
        const draftForms = await Form.countDocuments({ status: "draft" });
        const lastUpdated = await Form.findOne().sort({ updatedAt: -1 }).select("updatedAt");

        res.json({
            totalForms,
            activeForms,
            draftForms,
            lastUpdated: lastUpdated?.updatedAt || null,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getFormActivity = async (req, res) => {
    try {
        const activityData = [
            { day: "Mon", forms: 3 },
            { day: "Tue", forms: 5 },
            { day: "Wed", forms: 2 },
            { day: "Thu", forms: 6 },
            { day: "Fri", forms: 4 },
        ];
        res.json(activityData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
