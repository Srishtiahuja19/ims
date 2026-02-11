import { Request, Response } from "express";
import { jsend } from "../utils/jsend";
import { parseResume } from "../services/resumeParser";

export const uploadResume = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return jsend.error(res, "No file uploaded", 400);
        }

        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${encodeURIComponent(req.file.filename)}`;

        // Simulate Parsing
        const extractedData = await parseResume(req.file.path, req.file.originalname);

        return jsend.success(res, {
            fileUrl,
            filename: req.file.filename,
            extractedData
        });
    } catch (error: any) {
        return jsend.error(res, error.message || "Upload failed", 500);
    }
};
