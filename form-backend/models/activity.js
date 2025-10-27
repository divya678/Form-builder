import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    action: String,
    formName: String,
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Activity", activitySchema);
