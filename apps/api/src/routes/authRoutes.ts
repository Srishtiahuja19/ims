import express from "express";
import { loginAdmin, logoutAdmin, updatePassword, login } from "../controllers/authController";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware";
import { jsend } from "../utils/jsend";

const router = express.Router();

router.post("/login", login); // Unified Login
router.post("/admin/login", loginAdmin); // Legacy
router.post("/logout", logoutAdmin);

// Protected Route Example
router.get("/me", verifyUser, (req, res) => {
    jsend.success(res, (req as any).user);
});

router.put("/update-password", verifyUser, updatePassword);

export default router;
