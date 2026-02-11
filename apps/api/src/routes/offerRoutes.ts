import express from "express";
import { generateOffer, emailOffer } from "../controllers/offerController";

const router = express.Router();

router.get("/:studentId", generateOffer);
router.post("/:studentId/email", emailOffer);

export default router;
