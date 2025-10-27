import Activity from "../models/activity.js";

export const getRecentActivities = async (req, res) => {
    try {
        const activities = await Activity.find().sort({ timestamp: -1 }).limit(10);
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
