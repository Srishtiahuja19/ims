import puppeteer from "puppeteer";
import { getOfferLetterHtml } from "./offerTemplate";

interface Student {
    name: string;
    email: string;
    phone: string;
    rollNo: string;
    college: string;
    branch: string;
    role?: string;
    package?: string;
    joiningDate?: string;
    acceptanceDate?: string;
}

export async function generateOfferLetter(student: Student): Promise<Buffer> {
    try {
        console.log("Launching Puppeteer...");
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Get HTML content
        const htmlContent = getOfferLetterHtml(student);

        // Set content
        await page.setContent(htmlContent, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "0px",
                bottom: "0px",
                left: "0px",
                right: "0px"
            }
        });

        await browser.close();

        return Buffer.from(pdfBuffer);
    } catch (error: any) {
        console.error("Error generating offer letter:", error);
        throw new Error(`Failed to generate offer letter: ${error.message}`);
    }
}
