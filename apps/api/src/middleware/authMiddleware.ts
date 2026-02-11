import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model";
import { jsend } from "../utils/jsend";
import { env } from "@repo/env";

import { Student } from "../models/student.model";

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (!env.JWT_SECRET) {
        console.error("JWT_SECRET missing in environment");
        return jsend.error(res, "Internal Server Error", 500);
    }

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            if (!token) {
                return jsend.error(res, "Not authorized, no token", 401);
            }
            const decoded: any = jwt.verify(token, (env.JWT_SECRET as unknown) as string);

            // Check Admin first
            let user: any = await Admin.findById(decoded.id).select("-password");
            let role = "Admin";

            // If not admin, check Student
            if (!user) {
                user = await Student.findById(decoded.id).select("-passwordHash");
                role = "Student";
            }

            if (!user) {
                return jsend.error(res, "Not authorized, user not found", 401);
            }

            (req as any).user = user;
            // Explicitly set role on the request object as well to be safe, or ensure it's on the user object
            if (user && !user.role) {
                // If it's a mongoose document, we might need to use set() or just treat it as any
                (user as any).role = role;
            }
            console.log(`[Auth] User found. ID: ${user._id}, Role: ${(user as any).role}, Derived Role: ${role}`);

            next();
        } catch (error) {
            console.error("[Auth] Token verification failed:", error);
            return jsend.error(res, "Not authorized, token failed", 401);
        }
    } else {
        return jsend.error(res, "Not authorized, no token", 401);
    }
};

// Alias for backward compatibility if needed, or strictly enforce Admin for specific routes
export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    await verifyUser(req, res, () => {
        const userRole = (req as any).user?.role;
        console.log(`[Auth] verifyAdmin check. User Role: ${userRole}`);

        // Normalize role check (handle case sensitivity)
        const allowedRoles = ["admin", "Admin", "superadmin"];

        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            return jsend.error(res, "Not authorized as Admin", 403);
        }
    });
};
