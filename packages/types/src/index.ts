import { z } from "zod";

export enum UserRole {
    ADMIN = "Admin",
    STUDENT = "Student"
}

export enum OnboardingStatus {
    HIRED = "Hired",
    PENDING = "Pending",
    VERIFIED = "Verified",
    REJECTED = "Rejected"
}

export const exampleSchema = z.object({
    message: z.string(),
});

export const adminLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export type Example = z.infer<typeof exampleSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;

export const studentSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone number required"),
    rollNo: z.string().min(1, "Roll No is required"),
    branch: z.string().min(1, "Branch is required"),
    college: z.string().min(1, "College is required"),

    // Auth & Onboarding Fields
    passwordHash: z.string().optional(),
    role: z.nativeEnum(UserRole).default(UserRole.STUDENT),
    onboardingStatus: z.nativeEnum(OnboardingStatus).default(OnboardingStatus.HIRED),

    // Resume & Socials
    resumeUrl: z.string().url("Valid Resume URL required"),
    socialLinks: z.object({
        linkedin: z.string().url().optional().or(z.literal("")),
        github: z.string().url().optional().or(z.literal("")),
        portfolio: z.string().url().optional().or(z.literal("")),
    }).optional(),

    // Hiring Status (Legacy/Funnel)
    status: z.enum([
        "applied",
        "round1_pending", "round1_interviewed", "round1_selected", "round1_rejected",
        "round2_pending", "round2_interviewed", "round2_selected", "round2_rejected",
        "round3_pending", "round3_interviewed", "round3_selected", "round3_rejected",
        "round4_pending", "round4_interviewed", "round4_selected", "round4_rejected",
        "round5_pending", "round5_interviewed", "round5_selected", "round5_rejected",
        "hired", "rejected"
    ]).default("applied"),

    ratings: z.array(z.object({
        round: z.string(),
        rating: z.number().min(1).max(5),
        notes: z.string(),
        interviewerId: z.string()
    })).default([])
});

export type Student = z.infer<typeof studentSchema>;
