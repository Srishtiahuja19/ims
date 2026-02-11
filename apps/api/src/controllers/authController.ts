import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model";
import { Student } from "../models/student.model";
import { jsend } from "../utils/jsend";
import { adminLoginSchema } from "@repo/types";
import { env } from "@repo/env";
import { z } from "zod";
import bcrypt from "bcryptjs";

const generateToken = (id: string) => {
    return jwt.sign({ id }, env.JWT_SECRET as string, { expiresIn: "30d" });
};

const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = updatePasswordSchema.parse(req.body);

        // User is attached by verifyUser
        const currentUser = (req as any).user;

        if (!currentUser) {
            return jsend.error(res, "User not found", 404);
        }

        let user: any;
        let isMatch = false;

        // Re-fetch user to get password/passwordHash which are excluded in middleware
        if (currentUser.role === "Admin" || currentUser instanceof Admin) {
            user = await Admin.findById(currentUser._id);
            if (user) {
                isMatch = await user.matchPassword(currentPassword);
            }
        } else {
            // Assume Student
            user = await Student.findById(currentUser._id);
            if (user && user.passwordHash) {
                isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
            }
        }

        if (!user) {
            return jsend.error(res, "User record not found", 404);
        }

        if (!isMatch) {
            return jsend.error(res, "Incorrect current password", 401);
        }

        // Update password
        if (user.matchPassword) {
            user.password = newPassword; // Admin model handles hashing on save
        } else {
            user.passwordHash = await bcrypt.hash(newPassword, 10); // Manual hash for Student
        }

        await user.save();

        return jsend.success(res, { message: "Password updated successfully" });

    } catch (error: any) {
        if (error.name === "ZodError") {
            throw error;
        }
        return jsend.error(res, error.message, 500);
    }
};

export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = adminLoginSchema.parse(req.body);

        const admin = await Admin.findOne({ email });

        if (admin && (await (admin as any).matchPassword(password))) {
            const token = generateToken(admin._id.toString());

            console.log("Setting cookie with token:", token); // DEBUG

            res.cookie("token", token, {
                httpOnly: true,
                secure: false, // Force false for localhost debugging
                sameSite: "lax", // Relax for localhost
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return jsend.success(res, {
                _id: admin._id,
                email: admin.email,
                role: admin.role,
                token,
            });
        } else {
            return jsend.error(res, "Invalid email or password", 401);
        }
    } catch (error: any) {
        if (error.name === "ZodError") {
            throw error; // Let global handler catch it
        }
        return jsend.error(res, error.message, 500);
    }
};

export const logoutAdmin = (req: Request, res: Response) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    return jsend.success(res, { message: "Logged out" });
};

export const login = async (req: Request, res: Response) => {
    try {
        // Unified Login - Email/Password
        // We can reuse adminLoginSchema as it's just email/password validation
        const { email, password } = adminLoginSchema.parse(req.body);

        let user: any = null;
        let role = "";
        let isMatch = false;

        // 1. Check Admin
        const admin = await Admin.findOne({ email });
        if (admin) {
            user = admin;
            role = "Admin";
            isMatch = await (admin as any).matchPassword(password);
        } else {
            // 2. Check Student
            const student = await Student.findOne({ email });
            if (student) {
                user = student;
                role = "Student";
                if (student.passwordHash) {
                    isMatch = await bcrypt.compare(password, student.passwordHash);
                }
            }
        }

        if (user && isMatch) {
            const token = generateToken(user._id.toString());

            res.cookie("token", token, {
                httpOnly: true,
                secure: false, // Force false for localhost
                sameSite: "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return jsend.success(res, {
                _id: user._id,
                email: user.email,
                role: role, // Explicitly return derived role
                token,
            });
        } else {
            return jsend.error(res, "Invalid email or password", 401);
        }

    } catch (error: any) {
        if (error.name === "ZodError") {
            throw error;
        }
        return jsend.error(res, error.message, 500);
    }
};
