import express from "express";
import { registerStudent, getAllStudents, bulkUpdateStatus, addEvaluation, sendCredentials, updateProfile, uploadResume, uploadDocument, verifyStudent } from "../controllers/studentController";
import { upload, handleUpload } from "../middleware/uploadMiddleware";
import { verifyAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerStudent);
router.get("/", getAllStudents);
router.patch("/bulk-update", verifyAdmin, bulkUpdateStatus);
router.post("/send-credentials", verifyAdmin, sendCredentials);
router.post("/:id/evaluate", addEvaluation);

// Onboarding Routes
router.patch("/:id/verify", verifyAdmin, verifyStudent);
router.patch("/:id/profile", updateProfile); // Authenticated Student
router.post("/:id/upload-resume", upload.single("resume"), uploadResume);
router.post("/:id/upload-document", handleUpload, uploadDocument);

export default router;
