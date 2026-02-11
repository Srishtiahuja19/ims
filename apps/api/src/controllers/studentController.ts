import { Request, Response } from "express";
import { Student } from "../models/student.model";
import { studentSchema, OnboardingStatus } from "@repo/types";
import { jsend } from "../utils/jsend";
import { generateRandomPassword, hashPassword } from "../utils/passwordUtils";
import { sendCredentialEmail } from "../services/emailService";

export const registerStudent = async (req: Request, res: Response) => {
    try {
        // Validate Input
        const validatedData = studentSchema.parse(req.body);

        // Check Duplicates
        const existingStudent = await Student.findOne({
            $or: [{ email: validatedData.email }, { rollNo: validatedData.rollNo }],
        });

        if (existingStudent) {
            if (existingStudent.email === validatedData.email) {
                return jsend.fail(res, { email: "Email already registered" });
            }
            if (existingStudent.rollNo === validatedData.rollNo) {
                return jsend.fail(res, { rollNo: "Roll Number already registered" });
            }
        }

        // Create Student
        const newStudent = await Student.create(validatedData);

        return jsend.success(res, newStudent, 201);
    } catch (error: any) {
        if (error.name === "ZodError") {
            throw error; // Handled by global error handler
        }
        return jsend.error(res, error.message, 500);
    }
};

export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const { driveId } = req.query;
        // Ideally filter by driveId when we link students to drives, 
        // for now just returning all as we haven't linked them yet.

        const students = await Student.find().sort({ createdAt: -1 });
        return jsend.success(res, students);
    } catch (error: any) {
        return jsend.error(res, error.message);
    }
};

export const bulkUpdateStatus = async (req: Request, res: Response) => {
    try {
        const { studentIds, status } = req.body;

        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return jsend.fail(res, { studentIds: "Student IDs array is required" });
        }

        if (!status) {
            return jsend.fail(res, { status: "Status is required" });
        }

        // Check if this is a promotion (status contains "selected")
        const isPromotion = status.includes("selected");

        if (isPromotion) {
            // Validate that all students have evaluations
            const students = await Student.find({ _id: { $in: studentIds } });
            const studentsWithoutEvaluation = students.filter(
                (student) => !student.ratings || student.ratings.length === 0
            );

            if (studentsWithoutEvaluation.length > 0) {
                const names = studentsWithoutEvaluation.map((s) => s.name).join(", ");
                return jsend.fail(res, {
                    validation: `Cannot promote students without evaluation: ${names}`,
                    studentsWithoutEvaluation: studentsWithoutEvaluation.map((s) => ({
                        id: s._id,
                        name: s.name,
                        rollNo: s.rollNo,
                    })),
                });
            }
        }

        // Update all students with the given IDs
        const updateDoc: any = { status };

        // Sync onboardingStatus if hired
        if (status === "hired") {
            updateDoc.onboardingStatus = OnboardingStatus.HIRED;
        }

        const result = await Student.updateMany(
            { _id: { $in: studentIds } },
            { $set: updateDoc }
        );

        return jsend.success(res, {
            message: `Updated ${result.modifiedCount} students`,
            modifiedCount: result.modifiedCount,
        });
    } catch (error: any) {
        return jsend.error(res, error.message);
    }
};

// Helper function to determine round from status
const getRoundFromStatus = (status: string): string => {
    if (status.includes("round1") || status === "applied") return "Round 1";
    if (status.includes("round2")) return "Round 2";
    if (status.includes("round3")) return "Round 3";
    if (status.includes("round4")) return "Round 4";
    if (status.includes("round5")) return "Round 5";
    return "Final Round";
};

export const addEvaluation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rating, notes } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return jsend.fail(res, { rating: "Rating must be between 1 and 5" });
        }

        if (!notes || notes.trim() === "") {
            return jsend.fail(res, { notes: "Notes are required" });
        }

        const student = await Student.findById(id);
        if (!student) {
            return jsend.fail(res, { student: "Student not found" });
        }

        // Determine current round from student status
        const currentRound = getRoundFromStatus(student.status);

        // Initialize ratings array if it doesn't exist
        if (!student.ratings) {
            student.ratings = [] as any;
        }

        // Add evaluation to ratings array
        student.ratings.push({
            round: currentRound,
            rating,
            notes,
            interviewerId: "admin",
        });

        await student.save();

        return jsend.success(res, student);
    } catch (error: any) {
        console.error("Error in addEvaluation:", error);
        return jsend.error(res, error.message);
    }
};

export const sendCredentials = async (req: Request, res: Response) => {
    try {
        const { studentIds } = req.body;

        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return jsend.fail(res, { studentIds: "Student IDs array is required" });
        }

        const stats = {
            processed: 0,
            success: 0,
            failed: 0,
            alreadyActive: 0
        };

        const students = await Student.find({ _id: { $in: studentIds } });

        for (const student of students) {
            stats.processed++;

            // Robust check: case-insensitive
            const onboardingStatus = String(student.onboardingStatus || '').toLowerCase();

            console.log(`Processing ${student.email} (${student._id}): onboardingStatus=${student.onboardingStatus}, status=${student.status}, derivedOnboarding=${onboardingStatus}`);

            // ALLOW ALL: Users explicitly requested to be able to resend credentials to verified students too.
            // This acts as a password reset.

            // ALLOW PENDING: If status is PENDING, we assume admin wants to RESEND/RESET credentials.

            try {
                // 1. Generate Creds
                const plainPassword = generateRandomPassword();
                const hashedPassword = await hashPassword(plainPassword);

                // 2. Update DB
                student.passwordHash = hashedPassword;
                // If they were Hired, move to Pending. If already Pending, stay Pending.
                student.onboardingStatus = OnboardingStatus.PENDING;
                await student.save();

                // 3. Send Email
                await sendCredentialEmail(student.email, plainPassword);

                stats.success++;
            } catch (err) {
                console.error(`Failed to generate creds for student ${student.email}:`, err);
                stats.failed++;
            }
        }

        return jsend.success(res, {
            message: `Processed ${stats.processed} students. Success: ${stats.success}, Failed: ${stats.failed}, Skipped: ${stats.alreadyActive}`,
            stats
        });

    } catch (error: any) {
        console.error("Error in sendCredentials:", error);
        return jsend.error(res, error.message);
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // OR from req.user
        const { socialLinks, portfolio } = req.body;

        const student = await Student.findById(id);
        if (!student) return jsend.error(res, "Student not found", 404);

        // Update fields if provided
        if (socialLinks) {
            student.socialLinks = { ...student.socialLinks, ...socialLinks };
        }
        if (portfolio) {
            if (!student.socialLinks) student.socialLinks = {};
            student.socialLinks.portfolio = portfolio;
        }

        await student.save();
        return jsend.success(res, student);
    } catch (error: any) {
        return jsend.error(res, error.message);
    }
};

export const uploadResume = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return jsend.fail(res, { file: "No file uploaded" });
        }

        const student = await Student.findById(id);
        if (!student) return jsend.error(res, "Student not found", 404);

        const resumeUrl = `/uploads/${file.filename}`;

        student.resumeUrl = resumeUrl;
        await student.save();

        return jsend.success(res, {
            message: "Resume uploaded successfully",
            resumeUrl
        });

    } catch (error: any) {
        return jsend.error(res, error.message);
    }
};

export const uploadDocument = async (req: Request, res: Response) => {
    try {
        console.log("Upload Document Request Body:", req.body);
        console.log("Upload Document File:", req.file);

        const { id } = req.params;
        const { documentName } = req.body; // 'aadhar', 'pan', '10th', '12th'
        const file = req.file;

        if (!file) return jsend.fail(res, { file: "No file uploaded" });
        if (!documentName) return jsend.fail(res, { documentName: "Document name is required" });

        const validDocs = ["aadhar", "pan", "10th", "12th"];
        if (!validDocs.includes(documentName)) {
            return jsend.fail(res, { documentName: "Invalid document name" });
        }

        const student = await Student.findById(id);
        if (!student) return jsend.error(res, "Student not found", 404);

        if (!student.documents) student.documents = [] as any;

        const docUrl = `/uploads/${file.filename}`;

        // Check if doc exists
        const existingDocIndex = student.documents.findIndex((d: any) => d.name === documentName);

        if (existingDocIndex >= 0) {
            // Update existing
            student.documents![existingDocIndex].url = docUrl;
            student.documents![existingDocIndex].status = 'pending'; // Reset status on re-upload
            student.documents![existingDocIndex].rejectionReason = undefined;
        } else {
            // Add new
            student.documents!.push({
                name: documentName,
                url: docUrl,
                status: 'pending'
            });
        }

        await student.save();

        return jsend.success(res, {
            message: `${documentName} uploaded successfully`,
            document: student.documents.find((d: any) => d.name === documentName)
        });

    } catch (error: any) {
        return jsend.error(res, error.message);
    }
};

export const verifyStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);
        if (!student) {
            return jsend.fail(res, { student: "Student not found" });
        }

        // Logic check: Can only verify if Pending (i.e. has credentials sent)
        if (student.onboardingStatus !== OnboardingStatus.PENDING) {
            return jsend.fail(res, {
                status: `Cannot verify student with status ${student.onboardingStatus}. Must be PENDING.`
            });
        }

        student.onboardingStatus = OnboardingStatus.VERIFIED;
        await student.save();

        return jsend.success(res, {
            message: "Student verified successfully",
            student
        });

    } catch (error: any) {
        return jsend.error(res, error.message);
    }
};
