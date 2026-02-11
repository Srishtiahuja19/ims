import { Response } from "express";

export const jsend = {
    success: (res: Response, data: any, statusCode = 200) => {
        return res.status(statusCode).json({
            status: "success",
            data,
        });
    },

    fail: (res: Response, data: any, statusCode = 400) => {
        return res.status(statusCode).json({
            status: "fail",
            data,
        });
    },

    error: (res: Response, message: string, statusCode = 500, code?: string, data?: any) => {
        return res.status(statusCode).json({
            status: "error",
            message,
            code,
            data,
        });
    },
};
