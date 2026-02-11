const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const path = require("path");

// Load environment variables from the root .env file
const envPath = path.resolve(__dirname, "../.env");
console.log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

const testEmail = async () => {
    console.log("Starting email test...");
    console.log("SMTP Config:");
    console.log(`  Host: ${process.env.SMTP_HOST}`);
    console.log(`  Port: ${process.env.SMTP_PORT}`);
    console.log(`  User: ${process.env.SMTP_USER}`);
    console.log(`  Pass: ${process.env.SMTP_PASS ? "****" : "MISSING"}`);

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("❌ Missing SMTP configuration in .env");
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        console.log("Verifying transporter connection...");
        await transporter.verify();
        console.log("✅ Transporter connection verified.");

        const mailOptions = {
            from: `"IMS Test" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to self for testing
            subject: "IMS System - Test Email",
            text: "If you are reading this, the email configuration is working correctly.",
            html: "<b>If you are reading this, the email configuration is working correctly.</b>",
        };

        console.log(`Attempting to send email to ${mailOptions.to}...`);
        const info = await transporter.sendMail(mailOptions);

        console.log("✅ Email sent successfully!");
        console.log(`  Message ID: ${info.messageId}`);
        console.log(`  Response: ${info.response}`);

    } catch (error) {
        console.error("❌ Email failed to send:");
        console.error(error);
    }
};

testEmail();
