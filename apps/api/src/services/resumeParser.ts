import fs from 'fs';
// Use require for legacy CommonJS library compatibility to prevent server crash
const pdf = require('pdf-parse');

export const parseResume = async (filePath: string, originalName: string) => {
    console.log("📄 Parsing resume:", filePath);
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        const text = data.text;

        console.log("✅ Resume parsed, text length:", text.length);

        // Basic Regex Extraction
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
        const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

        const emailMatch = text.match(emailRegex);
        const phoneMatch = text.match(phoneRegex);

        const linkedinRegex = /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/;
        const githubRegex = /(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?/;

        const linkedinMatch = text.match(linkedinRegex);
        const githubMatch = text.match(githubRegex);

        // Name Heuristics
        let extractedName = "";

        // 1. Try from Filename (Cleaning)
        let cleanFileName = originalName.replace(/\.pdf$/i, "");
        // Remove common separators and junk words
        cleanFileName = cleanFileName.replace(/[-_]/g, " ");
        cleanFileName = cleanFileName.replace(/\b(resume|cv|curriculum|vitae|updated|final|latest|draft|\d{4})\b/gi, "");
        cleanFileName = cleanFileName.replace(/\s+/g, " ").trim();

        if (cleanFileName.length > 2 && cleanFileName.length < 50) {
            extractedName = cleanFileName;
            // Capitalize First Letter of each word
            extractedName = extractedName.replace(/\b\w/g, l => l.toUpperCase());
        }

        // 2. Try First Line of PDF (Priority Source)
        // Helper to check if a string looks like a name
        const isLikelyName = (testStr: string): boolean => {
            const clean = testStr.trim();
            if (!clean || clean.length > 50) return false;
            // Must contain only letters, dots, spaces
            if (!/^[a-zA-Z\s.]+$/.test(clean)) return false;
            // Must be 2 to 4 words
            const words = clean.split(/\s+/);
            if (words.length < 2 || words.length > 4) return false;
            // Must not contain common resume keywords
            if (/resume|curriculum|vitae|bio|profile|summary|experience|work/i.test(clean)) return false;
            return true;
        };

        const lines = text.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);

        // Check first 3 lines for a name (sometimes there's a title header)
        for (let i = 0; i < Math.min(lines.length, 3); i++) {
            if (isLikelyName(lines[i])) {
                extractedName = lines[i];
                break; // Found a strong candidate, stop searching
            }
        }

        // Fallback: If still empty, use "Candidate"
        if (!extractedName) extractedName = "Candidate";

        // Keyword based skill extraction
        const skillKeywords = [
            "JavaScript", "TypeScript", "Python", "Java", "C++", "C#",
            "React", "Angular", "Vue", "Next.js", "Node.js", "Express",
            "MongoDB", "SQL", "PostgreSQL", "MySQL", "AWS", "Docker",
            "Kubernetes", "Git", "Machine Learning", "Data Analysis"
        ];

        const skills = skillKeywords.filter(skill =>
            text.toLowerCase().includes(skill.toLowerCase())
        );

        const normalizeUrl = (url: string) => {
            if (!url) return "";
            return url.startsWith("http") ? url : `https://${url}`;
        };

        return {
            name: extractedName,
            email: emailMatch ? emailMatch[0] : "",
            phone: phoneMatch ? phoneMatch[0] : "",
            linkedin: linkedinMatch ? normalizeUrl(linkedinMatch[0]) : "",
            github: githubMatch ? normalizeUrl(githubMatch[0]) : "",
            skills: skills,
            education: "Degree Placeholder",
            summary: text.substring(0, 200).replace(/\s+/g, ' ').trim() + "..."
        };
    } catch (error: any) {
        console.error("PDF Parsing Error Details:", error);
        return {
            name: `Parsing Failed: ${error.message}`,
            email: "",
            phone: "",
            skills: [],
            education: ""
        };
    }
};
