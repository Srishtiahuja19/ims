import mongoose, { Schema } from "mongoose";
import { UserRole, OnboardingStatus } from "@repo/types";

const studentSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        rollNo: { type: String, required: true, unique: true },
        branch: { type: String, required: true },
        college: { type: String, required: true },

        // Auth & Onboarding Fields
        passwordHash: { type: String },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.STUDENT
        },
        onboardingStatus: {
            type: String,
            enum: Object.values(OnboardingStatus),
            default: OnboardingStatus.HIRED
        },

        resumeUrl: { type: String, required: true },
        socialLinks: {
            linkedin: { type: String },
            github: { type: String },
            portfolio: { type: String },
        },

        // Hiring Status (Legacy/Funnel compatibility)
        status: {
            type: String,
            default: "applied",
            // Keeping raw strings here as per old schema unless we migrate all enum usage
        },

        ratings: [
            {
                round: String,
                rating: Number,
                notes: String,
                interviewerId: String
            }
        ],
        offerDetails: {
            role: { type: String, default: "Trainee Analyst" },
            package: { type: String, default: "8,00,000" },
            joiningDate: { type: String, default: "09th October 2025" },
            acceptanceDate: { type: String, default: "09th October 2025" }
        },
        tasks: [
            {
                description: { type: String, required: true },
                status: { type: String, enum: ["pending", "completed"], default: "pending" },
                assignedAt: { type: Date, default: Date.now },
                completedAt: { type: Date }
            }
        ],
        documents: [
            {
                name: { type: String, required: true, enum: ["aadhar", "pan", "10th", "12th"] },
                url: { type: String, required: true },
                status: {
                    type: String,
                    enum: ["pending", "approved", "rejected"],
                    default: "pending"
                },
                rejectionReason: { type: String }
            }
        ]
    },
    { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
