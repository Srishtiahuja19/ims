
import { Request, Response } from "express";
import { Student } from "../models/student.model";
import { jsend } from "../utils/jsend";
import { OnboardingStatus } from "@repo/types";

// Get hired/active interns (HIRED and VERIFIED statuses)
export const getInterns = async (req: Request, res: Response) => {
    try {
        const interns = await Student.find({
            $or: [
                // New onboardingStatus field (capitalized: "Hired", "Verified")
                { onboardingStatus: { $in: [OnboardingStatus.HIRED, OnboardingStatus.VERIFIED] } },
                // Legacy status field (lowercase: "hired")
                { status: { $regex: /^hired$/i } }
            ]
        }).sort({ createdAt: -1 });

        return jsend.success(res, interns);
    } catch (error: any) {
        return jsend.error(res, error.message);
    }
};

// Assign Task
export const assignTask = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const { description } = req.body;

        if (!description) return jsend.fail(res, { description: "Task description is required" });

        const student = await Student.findById(studentId);
        if (!student) return jsend.fail(res, { student: "Student not found" });

        student.tasks.push({
            description,
            status: "pending",
            assignedAt: new Date()
        });

        await student.save();
        return jsend.success(res, student);
    } catch (error: any) {
        return jsend.error(res, error.message);
    }
};

// Verify Documents (Approves the intern overall)
export const verifyDocuments = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;

        const student = await Student.findById(studentId);
        if (!student) return jsend.fail(res, { student: "Student not found" });

        // Logic: Move to VERIFIED state
        student.onboardingStatus = OnboardingStatus.VERIFIED;
        await student.save();

        return jsend.success(res, student);
    } catch (error: any) {
        return jsend.error(res, error.message);
    }
};

// Review Specific Document
export const reviewDocument = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const { documentName, status, rejectionReason } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return jsend.fail(res, { status: "Status must be 'approved' or 'rejected'" });
        }

        if (status === 'rejected' && !rejectionReason) {
            return jsend.fail(res, { rejectionReason: "Rejection reason is required when rejecting" });
        }

        const student = await Student.findById(studentId);
        if (!student) return jsend.fail(res, { student: "Student not found" });

        if (!student.documents) {
            student.documents = [] as any;
        }

        const docIndex = student.documents!.findIndex((d: any) => d.name === documentName);
        if (docIndex === -1) {
            return jsend.fail(res, { document: "Document not found" });
        }

        student.documents![docIndex].status = status;
        if (status === 'rejected') {
            student.documents![docIndex].rejectionReason = rejectionReason;
        } else {
            student.documents![docIndex].rejectionReason = undefined; // Clear reason if approved
        }

        await student.save();
        return jsend.success(res, student);

    } catch (error: any) {
        return jsend.error(res, error.message);
    }
};

// Complete Task (Student marks task as done)
export const completeTask = async (req: Request, res: Response) => {
    try {
        const { studentId, taskIndex } = req.params;

        const student = await Student.findById(studentId);
        if (!student) return jsend.fail(res, { student: "Student not found" });

        if (!student.tasks || !student.tasks[parseInt(taskIndex)]) {
            return jsend.fail(res, { task: "Task not found" });
        }

        student.tasks[parseInt(taskIndex)].status = "completed";
        await student.save();

        return jsend.success(res, student);
    } catch (error: any) {
        return jsend.error(res, error.message);
    }
};
