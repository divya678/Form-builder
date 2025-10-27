import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        fields: { type: Array, default: [] },
        status: { type: String, enum: ["active", "draft"], default: "draft" },
    },
    { timestamps: true }
);

export default mongoose.model("Form", formSchema);
