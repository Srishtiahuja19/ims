import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "@repo/types";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Upload, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "../context/ToastContext";

type Step = "UPLOAD" | "REVIEW" | "SUCCESS";

export default function Registration() {
    const [step, setStep] = useState<Step>("UPLOAD");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { showToast } = useToast();

    // Form Setup
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<any>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            status: "applied",
            name: "",
            email: "",
            phone: "",
            rollNo: "",
            branch: "",
            college: "",
            resumeUrl: "",
            socialLinks: { linkedin: "", github: "", portfolio: "" }
        } as any
    });

    // Handle File Upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("resume", file);

        try {
            // Using shared api client
            const res = await api.post("/resume/upload", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { fileUrl, extractedData } = res.data.data;

            // Auto-fill form
            setValue("resumeUrl", fileUrl);
            setValue("name", extractedData.name || "");
            setValue("email", extractedData.email || "");
            setValue("phone", extractedData.phone || "");
            if (extractedData.linkedin) setValue("socialLinks.linkedin", extractedData.linkedin);
            if (extractedData.github) setValue("socialLinks.github", extractedData.github);

            // Move to next step
            setStep("REVIEW");
        } catch (error: any) {
            console.error("Upload failed", error);
            const msg = error.response?.data?.message || error.message || "Failed to upload resume";
            showToast(`Upload failed: ${msg}`, "error");
        } finally {
            setIsUploading(false);
        }
    };

    // Handle Final Submission
    const onSubmit: SubmitHandler<any> = async (data) => {
        console.log("📤 Submitting data:", data);
        setErrorMessage(null); // Clear previous errors
        setIsSubmitting(true);
        try {
            await api.post("/student/register", data);
            setStep("SUCCESS");
        } catch (error: any) {
            console.error("❌ Registration failed:", error);
            console.error("Response data:", error.response?.data);

            // Extract error message from various possible formats
            let msg = "Registration failed";
            if (error.response?.data) {
                const responseData = error.response.data;
                // JSend format: {status: "fail", data: {email: "Email already registered"}}
                if (responseData.data) {
                    const errors = responseData.data;
                    if (typeof errors === 'object') {
                        // Get first error message
                        msg = Object.values(errors)[0] as string;
                    } else if (typeof errors === 'string') {
                        msg = errors;
                    }
                } else if (responseData.message) {
                    msg = responseData.message;
                }
            }

            setErrorMessage(msg);
            // Scroll to top to show error
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950">
            <div className="glass-card w-full max-w-md p-8 relative overflow-hidden border-blue-500/20">

                {/* Step 1: Upload */}
                {step === "UPLOAD" && (
                    <div className="glass-card p-8 max-w-2xl w-full space-y-6 animate-in fade-in zoom-in duration-500 border-blue-500/10">
                        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                            Flash Apply
                        </h1>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 animate-in fade-in slide-in-from-top duration-300">
                                <p className="text-red-300 text-sm font-medium">❌ {errorMessage}</p>
                            </div>
                        )}
                        <p className="text-white/70">Upload your resume to get started</p>

                        <div className="border-2 border-dashed border-white/20 rounded-xl p-10 hover:bg-white/5 transition-colors relative">
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={isUploading}
                            />
                            <div className="flex flex-col items-center gap-2">
                                {isUploading ? (
                                    <Loader2 className="w-10 h-10 animate-spin text-blue-300" />
                                ) : (
                                    <Upload className="w-10 h-10 text-blue-300" />
                                )}
                                <span className="text-sm font-medium">
                                    {isUploading ? "Analysing Resume..." : "Tap to Upload PDF"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Review Form */}
                {step === "REVIEW" && (
                    <form onSubmit={handleSubmit(onSubmit, (errors) => {
                        console.error("❌ Validation Failed:", errors);

                        // Helper to traverse error object
                        const getErrorMessages = (errObj: any, path = ""): string[] => {
                            let messages: string[] = [];
                            for (const key in errObj) {
                                const newPath = path ? `${path}.${key}` : key;
                                if (errObj[key].message) {
                                    messages.push(`${newPath}: ${errObj[key].message}`);
                                } else if (typeof errObj[key] === "object") {
                                    messages = [...messages, ...getErrorMessages(errObj[key], newPath)];
                                }
                            }
                            return messages;
                        };

                        const errorMsgs = getErrorMessages(errors);
                        showToast(`Validation Errors:\n${errorMsgs.join("\n")}`, "error");
                    })} className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Review Details</h2>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 animate-in fade-in slide-in-from-top duration-300">
                                <p className="text-red-300 text-sm font-medium">❌ {errorMessage}</p>
                            </div>
                        )}

                        <Input label="Full Name" {...register("name")} error={errors.name?.message as string} />
                        <Input label="Email" type="email" {...register("email")} error={errors.email?.message as string} />
                        <Input label="Phone" {...register("phone")} error={errors.phone?.message as string} />
                        <Input label="Roll No" {...register("rollNo")} error={errors.rollNo?.message as string} />

                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Branch" {...register("branch")} error={errors.branch?.message as string} />
                            <Input label="College" {...register("college")} error={errors.college?.message as string} />
                        </div>

                        <div className="space-y-2 pt-2 border-t border-white/10">
                            <p className="text-sm font-medium text-white/80">Social Links (Optional)</p>
                            <Input placeholder="LinkedIn URL" {...register("socialLinks.linkedin")} />
                            <Input placeholder="GitHub URL" {...register("socialLinks.github")} />
                            <Input placeholder="Portfolio URL" {...register("socialLinks.portfolio")} />
                        </div>

                        <input type="hidden" {...register("resumeUrl")} />
                        <input type="hidden" {...register("status")} />

                        <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
                            {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Application"}
                        </Button>
                    </form>
                )}

                {/* Step 3: Success */}
                {step === "SUCCESS" && (
                    <div className="text-center space-y-4 py-10">

                        <CheckCircle className="w-20 h-20 text-green-400 mx-auto" />
                        <h2 className="text-2xl font-bold">Application Sent!</h2>
                        <p className="text-white/70">We have received your details.</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Submit Another
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
}