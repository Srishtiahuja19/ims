import express from "express";
import { createDrive, getDrives } from "../controllers/driveController";
// import { verifyAdmin } from "../middleware/authMiddleware"; // TODO: Uncomment when Admin Auth is fully wired in frontend

const router = express.Router();

// Protected Routes (temporarily public for rapid dev testing if auth token missing)
router.post("/", createDrive);
router.get("/", getDrives);

export default router;
