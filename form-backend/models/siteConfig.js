import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema({
    smtpHost: String,
    smtpPort: Number,
    formEmail: String,
    username: String,
    password: String,
});

export default mongoose.model("SiteConfig", siteConfigSchema);
