
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Define Student Schema inline to avoid import issues
const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        status: { type: String },
        onboardingStatus: { type: String },
        tasks: [{ type: Object }] // Simple array
    },
    { strict: false } // Allow reading fields not strictly defined here
);

const Student = mongoose.model("Student", studentSchema);

const run = async () => {
    try {
        let uri = process.env.MONGODB_URI;
        if (!uri) {
            console.log("No MONGODB_URI in env, trying default local");
            uri = "mongodb://localhost:27017/ims";
        }

        console.log("Connecting to:", uri);
        await mongoose.connect(uri);
        console.log("Connected to DB");

        const students = await Student.find({}).sort({ createdAt: -1 });
        console.log(`Found ${students.length} students.`);

        console.table(students.map((s: any) => ({
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
