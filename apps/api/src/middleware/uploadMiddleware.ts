import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Unique filename: timestamp-originalName
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF, JPG, and PNG files are allowed"), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB Limit
    },
});

export const handleUpload = (req: any, res: any, next: any) => {
    const uploadSingle = upload.single("document");

    uploadSingle(req, res, (err: any) => {
        if (err) {
            console.error("Multer Upload Error:", err);
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({ status: "fail", message: "File is too large. Max limit is 5MB." });
                }
                return res.status(400).json({ status: "fail", message: err.message });
            }
            return res.status(400).json({ status: "fail", message: err.message });
        }
        console.log("File Uploaded Middleware Success:", req.file);
        next();
    });
};
