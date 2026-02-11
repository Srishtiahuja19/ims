import "./setupEnv"; // Must be first
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import { jsend } from "./utils/jsend";
import { exampleSchema } from "@repo/types";
import authRoutes from "./routes/authRoutes";
import resumeRoutes from "./routes/resumeRoutes";
import studentRoutes from "./routes/studentRoutes";
import driveRoutes from "./routes/driveRoutes";
import offerRoutes from "./routes/offerRoutes";
import adminRoutes from "./routes/adminRoutes";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow any localhost origin
        if (origin.match(/^http:\/\/localhost:\d+$/)) {
            return callback(null, true);
        }

        // Block others
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Static Uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/drives", driveRoutes);
app.use("/api/offer", offerRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    jsend.success(res, { message: "IMS API is running" });
});

// Test JSend Success
app.get("/test/success", (req, res) => {
    jsend.success(res, { foo: "bar" });
});

// Test Validation Error
app.post("/test/validation", (req, res) => {
    // This will throw if invalid, caught by formatted handler
    const data = exampleSchema.parse(req.body);
    jsend.success(res, data);
});

// Test 404
app.use((req, res) => {
    jsend.error(res, "Endpoint not found", 404);
});

// Global Error Handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
