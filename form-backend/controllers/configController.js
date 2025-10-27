import SiteConfig from "../models/siteConfig.js";

// Get SMTP config
export const getSMTPConfig = async (req, res) => {
    try {
        const config = await SiteConfig.findOne();
        res.json(config);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update SMTP config
export const updateSMTPConfig = async (req, res) => {
    try {
        const config = await SiteConfig.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(config);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
