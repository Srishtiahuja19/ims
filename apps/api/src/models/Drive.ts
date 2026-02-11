import mongoose, { Document, Schema } from "mongoose";

export interface IDrive extends Document {
    name: string;
    date: Date;
    status: "active" | "upcoming" | "completed";
    rounds: any[]; // We'll define rounds strictly later
}

const DriveSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        date: { type: Date, required: true },
        status: {
            type: String,
            enum: ["active", "upcoming", "completed"],
            default: "upcoming",
        },
        rounds: { type: [Object], default: [] },
    },
    { timestamps: true }
);

export const Drive = mongoose.model<IDrive>("Drive", DriveSchema);
