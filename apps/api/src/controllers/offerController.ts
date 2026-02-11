import { Request, Response } from "express";
import { Student } from "../models/student.model";
import { jsend } from "../utils/jsend";
import { generateOfferLetter } from "../services/pdfGenerator";
import { sendOfferEmail } from "../services/emailService";
import { OnboardingStatus } from "@repo/types";

export const generateOffer = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;

        // Fetch student
        const student = await Student.findById(studentId);
        if (!student) {
            return jsend.fail(res, { student: "Student not found" });
        }

        if (student.status !== 'hired' && student.onboardingStatus !== OnboardingStatus.VERIFIED) {
            return jsend.fail(res, { status: "Student is not hired or verified. Cannot generate offer." });
        }

        // Generate PDF
        const pdfBuffer = await generateOfferLetter({
            name: student.name,
            email: student.email,
            phone: student.phone,
            rollNo: student.rollNo,
            college: student.college,
            branch: student.branch,
            role: student.offerDetails?.role || "Trainee Analyst",
            package: student.offerDetails?.package || "8,00,000",
            joiningDate: student.offerDetails?.joiningDate || "09th October 2025",
            acceptanceDate: student.offerDetails?.acceptanceDate || "09th October 2025",
        });

        // Set headers for PDF download or preview
        const disposition = req.query.preview === 'true' ? 'inline' : 'attachment';
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `${disposition}; filename="Offer-Letter-${student.name}.pdf"`);

        return res.send(pdfBuffer);
    } catch (error: any) {
        console.error("Error in generateOffer:", error);
        return jsend.error(res, error.message);
    }
};

export const emailOffer = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;

        // Fetch student
        const student = await Student.findById(studentId);
        if (!student) {
            return jsend.fail(res, { student: "Student not found" });
        }

        // Guardrail: Ensure student is verified or hired
        if (student.status !== 'hired' && student.onboardingStatus !== OnboardingStatus.VERIFIED) {
            return jsend.fail(res, { status: "Student is not hired or verified. Cannot send offer." });
        }

        // Generate PDF
        const pdfBuffer = await generateOfferLetter({
            name: student.name,
            email: student.email,
            phone: student.phone,
            rollNo: student.rollNo,
            college: student.college,
            branch: student.branch,
            role: student.offerDetails?.role || "Trainee Analyst",
            package: student.offerDetails?.package || "8,00,000",
            joiningDate: student.offerDetails?.joiningDate || "09th October 2025",
            acceptanceDate: student.offerDetails?.acceptanceDate || "09th October 2025",
        });

        // Send Email
        const result = await sendOfferEmail(student.email, student.name, pdfBuffer);

        return jsend.success(res, {
            message: "Offer letter sent successfully",
            ...result,
        });

    } catch (error: any) {
        console.error("Error in emailOffer:", error);
        return jsend.error(res, error.message);
    }
};
