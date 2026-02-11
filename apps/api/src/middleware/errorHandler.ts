import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { jsend } from "../utils/jsend";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Global Error:", err);

    if (err instanceof ZodError) {
        // Format Zod errors as JSend fail
        const formattedErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
            const field = e.path.join(".");
            formattedErrors[field] = e.message;
        });
        return jsend.fail(res, formattedErrors, 400);
    }

    // Handle other known errors or return 500
    return jsend.error(res, err.message || "Internal Server Error", 500);
};
