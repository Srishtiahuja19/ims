import nodemailer from "nodemailer";
import { env } from "@repo/env";

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// DEBUG LOGGING
console.log("--- SMTP CONFIG CHECK ---");
console.log("HOST:", process.env.SMTP_HOST || "DEFAULT(smtp.gmail.com)");
console.log("PORT:", process.env.SMTP_PORT || "DEFAULT(587)");
console.log("USER:", process.env.SMTP_USER ? "***" : "MISSING");
console.log("PASS:", process.env.SMTP_PASS ? "***" : "MISSING");
console.log("-------------------------");

export const sendOfferEmail = async (
    to: string,
    studentName: string,
    pdfBuffer: Buffer
) => {
    try {
        console.log(`Attempting to send email to ${to}...`);

        // Define email options
        const mailOptions = {
            from: `"IMS Admin" <${process.env.SMTP_USER}>`, // sender address
            to: to, // list of receivers
            subject: "Congratulations! Internship Offer Letter - IMS", // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6b21a8;">Congratulations, ${studentName}! 🎉</h2>
                    <p>We are pleased to offer you an internship position at our company.</p>
                    <p>Your official Offer Letter is attached to this email. Please review it carefully.</p>
                    <p><strong>Next Steps:</strong></p>
                    <ul>
                        <li>Download the attachment.</li>
                        <li>Sign the document.</li>
                        <li>Reply to this email with the signed copy within 3 days.</li>
                    </ul>
                    <p>We look forward to having you on board!</p>
                    <br/>
                    <p>Best regards,</p>
                    <p><strong>IMS HR Team</strong></p>
                </div>
            `,
            attachments: [
                {
                    filename: `Offer_Letter_${studentName.replace(/\s+/g, "_")}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        };

        // Send mail
        const info = await transporter.sendMail(mailOptions);

        console.log("Message sent: %s", info.messageId);

        // If using Ethereal (fake SMTP), log the preview URL
        if (process.env.SMTP_HOST?.includes("ethereal")) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            return { messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
        }

        return { messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};
export const sendCredentialEmail = async (to: string, password: string) => {
    try {
        console.log(`Attempting to send credential email to ${to}...`);

        const mailOptions = {
            from: `"IMS Admin" <${process.env.SMTP_USER || "noreply@ims.com"}>`,
            to: to,
            subject: "Your IMS Portal Login Credentials",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #6b21a8; margin-bottom: 20px;">Welcome to IMS! 🚀</h2>
                    <p>Dear Candidate,</p>
                    <p>Congratulations on being selected! We have created an account for you to access the Onboarding Portal.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Username:</strong> ${to}</p>
                        <p style="margin: 5px 0;"><strong>Password:</strong> <span style="font-family: monospace; background: #fff; padding: 2px 6px; border-radius: 4px; border: 1px solid #ddd;">${password}</span></p>
                    </div>

                    <p>Please login and complete your onboarding profile immediately.</p>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/login" style="background-color: #6b21a8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login to Portal</a>
                    </div>
                    
                    <br/>
                    <p>Best regards,</p>
                    <p><strong>IMS HR Team</strong></p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Credential Email sent: %s", info.messageId);

        if (process.env.SMTP_HOST?.includes("ethereal")) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending credential email:", error);
        // Don't throw, just log, so we don't break the bulk process flow 
        // (controller handles success count based on try/catch but here we return success false if we want stricter handling)
        throw error;
    }
};
