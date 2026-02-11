import { Request, Response } from "express";
import { Drive } from "../models/Drive";
import { jsend } from "../utils/jsend";

export const createDrive = async (req: Request, res: Response) => {
    try {
        const { name, date } = req.body;

        if (!name || !date) {
            return jsend.fail(res, { message: "Name and Date are required" });
        }

        const drive = await Drive.create({ name, date });
        return jsend.success(res, drive, 201);
    } catch (error: any) {
        return jsend.error(res, error.message);
    }
};

export const getDrives = async (req: Request, res: Response) => {
    try {
        const drives = await Drive.find().sort({ createdAt: -1 });
        return jsend.success(res, drives);
    } catch (error: any) {
        return jsend.error(res, error.message);
    }
};
