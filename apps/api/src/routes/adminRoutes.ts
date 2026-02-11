
import express from "express";
import { getInterns, assignTask, verifyDocuments, reviewDocument, completeTask } from "../controllers/adminController";
import { verifyUser as protect, verifyAdmin as adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Student-accessible route (must be before adminOnly middleware)
router.patch("/complete-task/:studentId/:taskIndex", completeTask);

// Admin-only routes
router.use(adminOnly);
router.get("/interns", getInterns);
router.post("/assign-task/:studentId", assignTask);
router.patch("/verify-docs/:studentId", verifyDocuments);
router.patch("/review-doc/:studentId", reviewDocument);

export default router;
