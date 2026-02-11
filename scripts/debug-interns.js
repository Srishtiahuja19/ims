
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Define Student Schema inline
const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        status: { type: String },
        onboardingStatus: { type: String },
        tasks: [{ type: Object }]
    },
    { strict: false }
);

// Prevent overwriting model if it exists
const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

const run = async () => {
    try {
        let uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
        if (!uri) {
            console.log("No MONGODB_URI or DATABASE_URL in env, trying default local");
            uri = "mongodb://localhost:27017/ims";
        }

        console.log("Connecting to:", uri);
        await mongoose.connect(uri);
        console.log("Connected to DB");

        const students = await Student.find({}).sort({ createdAt: -1 });
        console.log(`Found ${students.length} students.`);

        const query = {
            $or: [
                { onboardingStatus: { $in: ["Pending", "Hired", "Verified", "pending", "hired", "verified"] } },
                { status: { $regex: /hired|selected/i } }
            ]
        };
        console.log("Testing Query:", JSON.stringify(query, null, 2));
        const matches = await Student.find(query);
        console.log(`Query matched ${matches.length} students.`);

        matches.forEach(m => console.log(` - ${m.name} (${m.status}, ${m.onboardingStatus})`));

        console.table(students.map(s => ({
            _id: s._id.toString(),
            name: s.name,
            email: s.email,
            status: s.status,
            onboardingStatus: s.onboardingStatus,
            tasks: s.tasks ? s.tasks.length : 0
        })));

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
