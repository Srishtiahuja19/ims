import mongoose from "mongoose";
import { env } from "@repo/env";

export const connectDB = async () => {
    try {
        if (!env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not defined in environment");
        }

        mongoose.set("strictQuery", true);

        await mongoose.connect(env.DATABASE_URL);

        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
};
