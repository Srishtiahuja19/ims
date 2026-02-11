import "./setupEnv"; // Must be first
import mongoose from "mongoose";
import { env } from "@repo/env";
import { Admin } from "./models/admin.model";

const seedAdmin = async () => {
    try {
        await mongoose.connect(env.DATABASE_URL);
        console.log("Connected to DB");

        const existingAdmin = await Admin.findOne({ email: "admin@ims.com" });
        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const admin = new Admin({
            email: "admin@ims.com",
            password: "password123", // Will be hashed by pre-save
            role: "superadmin"
        });

        await admin.save();
        console.log("✅ Super Admin created: admin@ims.com / password123");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding:", error);
        process.exit(1);
    }
};

seedAdmin();
