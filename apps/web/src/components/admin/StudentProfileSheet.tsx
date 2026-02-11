import { X, Mail, Phone, Linkedin, Github, Globe, Download, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { StarRating } from "../ui/StarRating";
import { StudentJourney } from "./StudentJourney";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api"; // Shared API
import { useToast } from "../../context/ToastContext";

interface Student {
    _id: string;
    name: string;
    email: string;
    phone: string;
    rollNo: string;
    college: string;
    branch: string;
    status: string;
    resumeUrl?: string;
    socialLinks?: {
        linkedin?: string;
        github?: string;
        portfolio?: string;
    };
    ratings?: Array<{
        round: string;
        rating: number;
        notes: string;
        interviewerId: string;
    }>;
}

interface StudentProfileSheetProps {
    student: Student | null;
    isOpen: boolean;
    onClose: () => void;
}

export function StudentProfileSheet({ student, isOpen, onClose }: StudentProfileSheetProps) {
    const [rating, setRating] = useState(0);
    const [notes, setNotes] = useState("");
    const [showOfferPreview, setShowOfferPreview] = useState(false);
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const evaluationMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/student/${student?._id}/evaluate`, { // api client
                rating,
                notes,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
            setRating(0);
            setNotes("");
            showToast("Evaluation saved successfully!", "success");
        },
        onError: (error: any) => {
            const msg = error.response?.data?.data?.rating || error.response?.data?.data?.notes || "Failed to save evaluation";
            showToast(msg, "error");
        },
    });

    const handleSaveEvaluation = () => {
        if (rating === 0) {
            showToast("Please select a rating", "error");
            return;
        }
        if (!notes.trim()) {
            showToast("Please add notes", "error");
            return;
        }
        evaluationMutation.mutate();
    };

    // Helper to determine current round from status
    const getRoundFromStatus = (status: string): string => {
        if (status.includes("round1") || status === "applied") return "Round 1";
        if (status.includes("round2")) return "Round 2";
        if (status.includes("round3")) return "Round 3";
        if (status.includes("round4")) return "Round 4";
        if (status.includes("round5")) return "Round 5";
        return "Final Round";
    };

    const currentRound = student ? getRoundFromStatus(student.status) : "Round 1";

    const statusMutation = useMutation({
        mutationFn: async (newStatus: string) => {
            if (!student) return;
            const res = await api.patch(`/student/bulk-update`, {
                studentIds: [student._id],
                status: newStatus
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
            onClose(); // Close sheet on status change
            showToast("Candidate status updated!", "success");
        },
        onError: (error: any) => {
            showToast(`Failed to update status: ${error.response?.data?.message || error.message}`, "error");
        }
    });

    const emailMutation = useMutation({
        mutationFn: async () => {
            if (!student) return;
            const res = await api.post(`/offer/${student._id}/email`);
            return res.data;
        },
        onSuccess: (data) => {
            showToast("Offer Letter Sent Successfully!", "success");
            if (data?.data?.previewUrl) {
                console.log("Preview URL:", data.data.previewUrl);
                window.open(data.data.previewUrl, "_blank");
            }
        },
        onError: (error: any) => {
            showToast(`Failed to send email: ${error.response?.data?.message || error.message}`, "error");
        }
    });

    const handleSendEmail = () => {
        if (student && confirm(`Send official Offer Letter to ${student.email}?`)) {
            emailMutation.mutate();
        }
    };

    const handleReject = () => {
        if (confirm("Are you sure you want to REJECT this candidate?")) {
            // Determine rejection status based on current round
            const roundPrefix = currentRound.toLowerCase().replace(" ", ""); // round1
            const rejectStatus = roundPrefix === "finalround" ? "rejected" : `${roundPrefix}_rejected`;
            statusMutation.mutate(rejectStatus);
        }
    };

    const handlePromote = () => {
        if (!student) return;

        // 1. Strict Validation: Must have rating for current round
        if (currentRound !== "Round 1") {
            const hasRating = student.ratings?.some(r => r.round === currentRound);

            if (!hasRating) {
                showToast(`Cannot promote without rating! Please submit an evaluation for ${currentRound} first.`, "error");
                return;
            }
        }

        if (confirm(`Promote candidate to next round?`)) {
            let nextStatus = "hired";
            if (currentRound === "Round 1") nextStatus = "round2_pending";
            else if (currentRound === "Round 2") nextStatus = "round3_pending";
            else if (currentRound === "Round 3") nextStatus = "round4_pending";
            else if (currentRound === "Round 4") nextStatus = "round5_pending";
            else if (currentRound === "Round 5") nextStatus = "hired";

            statusMutation.mutate(nextStatus);
        }
    };

    if (!student) return null;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                    onClick={onClose}
                />
            )}

            {/* Modal Container */}
            <div
                className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[90vh] bg-[#1a1635] border border-white/10 rounded-2xl z-50 overflow-y-auto shadow-2xl transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
                <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{student.name}</h2>
                            <p className="text-white/50 text-sm">{student.rollNo}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Journey Map */}
                    <div className="w-full">
                        <StudentJourney status={student.status} />
                    </div>

                    {/* Status Badge */}
                    <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block
              ${student.status === "applied" ? "bg-blue-500/20 text-blue-300" : ""}
              ${student.status.includes("selected") ? "bg-green-500/20 text-green-300" : ""}
              ${student.status.includes("rejected") ? "bg-red-500/20 text-red-300" : ""}
            `}>
                            {student.status.replace("_", " ").toUpperCase()}
                        </span>
                    </div>

                    {/* Contact Information */}
                    <div className="glass-card p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>

                        <div className="flex items-center gap-3 text-white/70">
                            <Mail className="w-4 h-4 text-purple-400" />
                            <a href={`mailto:${student.email}`} className="hover:text-white transition-colors">
                                {student.email}
                            </a>
                        </div>

                        <div className="flex items-center gap-3 text-white/70">
                            <Phone className="w-4 h-4 text-purple-400" />
                            <a href={`tel:${student.phone}`} className="hover:text-white transition-colors">
                                {student.phone}
                            </a>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="glass-card p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Academic Details</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-white/50 text-sm">College</p>
                                <p className="text-white font-medium">{student.college}</p>
                            </div>
                            <div>
                                <p className="text-white/50 text-sm">Branch</p>
                                <p className="text-white font-medium">{student.branch}</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    {(student.socialLinks?.linkedin || student.socialLinks?.github || student.socialLinks?.portfolio) && (
                        <div className="glass-card p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>

                            <div className="space-y-3">
                                {student.socialLinks?.linkedin && (
                                    <a
                                        href={student.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                                    >
                                        <Linkedin className="w-4 h-4 text-blue-400" />
                                        <span>LinkedIn Profile</span>
                                    </a>
                                )}

                                {student.socialLinks?.github && (
                                    <a
                                        href={student.socialLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                                    >
                                        <Github className="w-4 h-4 text-purple-400" />
                                        <span>GitHub Profile</span>
                                    </a>
                                )}

                                {student.socialLinks?.portfolio && (
                                    <a
                                        href={student.socialLinks.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                                    >
                                        <Globe className="w-4 h-4 text-green-400" />
                                        <span>Portfolio</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Resume Section */}
                    {student.resumeUrl && (
                        <div className="glass-card p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Resume</h3>

                            <div className="space-y-4">
                                {/* Resume Preview */}
                                <div className="bg-black/20 rounded-lg overflow-hidden border border-white/10">
                                    <iframe
                                        src={`${student.resumeUrl}#view=FitH&toolbar=0&navpanes=0`}
                                        className="w-full h-[800px]"
                                        title="Resume Preview"
                                    />
                                </div>

                                {/* Download Button */}
                                <a
                                    href={student.resumeUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="secondary" className="w-full">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Resume
                                    </Button>
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Evaluation Section */}
                    <div className="glass-card p-6 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">
                                {currentRound === "Round 1" ? "Screening Decision" : "Evaluation"}
                            </h3>
                            {currentRound !== "Round 1" && (
                                <span className="text-sm text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">
                                    Evaluating for {currentRound}
                                </span>
                            )}
                        </div>

                        {/* Existing Evaluations */}
                        {student.ratings && student.ratings.length > 0 && (
                            <div className="space-y-3 mb-4">
                                <p className="text-white/50 text-sm">Previous Evaluations:</p>
                                {student.ratings.map((evaluation, index) => (
                                    <div key={index} className="bg-white/5 rounded-lg p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/70 text-sm">{evaluation.round}</span>
                                            <StarRating value={evaluation.rating} readonly />
                                        </div>
                                        <p className="text-white/60 text-sm">{evaluation.notes}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New Evaluation Form */}
                        {/* New Evaluation Form */}
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            {currentRound !== "Round 1" && !student.status.includes("rejected") && student.status !== "hired" && (
                                <>
                                    <div>
                                        <label className="text-white/70 text-sm mb-2 block">Rating</label>
                                        <StarRating value={rating} onChange={setRating} />
                                    </div>

                                    <div>
                                        <label className="text-white/70 text-sm mb-2 block">Notes</label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                                            placeholder="Add your evaluation notes..."
                                        />
                                    </div>

                                    <Button
                                        onClick={handleSaveEvaluation}
                                        disabled={evaluationMutation.isPending}
                                        className="w-full"
                                    >
                                        {evaluationMutation.isPending ? "Saving..." : "Save Evaluation"}
                                    </Button>
                                </>
                            )}

                            {student.status.includes("rejected") && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                                    <p className="text-red-200 font-medium">Application Terminated</p>
                                    <p className="text-red-200/60 text-sm mt-1">This candidate has been rejected.</p>
                                </div>
                            )}

                            {student.status === "hired" && (
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                                    <p className="text-green-200 font-medium">Candidate Hired</p>
                                    <p className="text-green-200/60 text-sm mt-1">Evaluation process is complete.</p>
                                </div>
                            )}

                            {/* Decision Buttons */}
                            {!student.status.includes("rejected") && !student.status.includes("hired") && (
                                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
                                    <Button
                                        onClick={handleReject}
                                        variant="destructive"
                                        className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/50"
                                        disabled={statusMutation.isPending}
                                    >
                                        Reject Candidate
                                    </Button>
                                    <Button
                                        onClick={handlePromote}
                                        className="w-full bg-green-500/20 hover:bg-green-500/40 text-green-300 border border-green-500/50"
                                        disabled={statusMutation.isPending}
                                    >
                                        Promote to Next
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Generate Offer Letter Button */}
                    {student.status === "hired" && (
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Offer Letter</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    onClick={() => setShowOfferPreview(true)}
                                    variant="outline"
                                    className="bg-transparent border-white/20 text-white hover:bg-white/5"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Preview PDF
                                </Button>

                                <Button
                                    onClick={() => handleSendEmail()}
                                    disabled={emailMutation.isPending}
                                    className={`bg-purple-500 hover:bg-purple-600 ${emailMutation.isPending ? "opacity-80" : ""}`}
                                >
                                    {emailMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Mail className="w-4 h-4 mr-2" />
                                    )}
                                    {emailMutation.isPending ? "Sending..." : "Send Email"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Offer Letter Preview Modal */}
            {showOfferPreview && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowOfferPreview(false)}
                    />
                    <div className="relative w-full max-w-5xl h-[85vh] bg-[#1a1635] rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#1a1635]">
                            <h3 className="text-xl font-bold text-white">Offer Letter Preview</h3>
                            <button
                                onClick={() => setShowOfferPreview(false)}
                                className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 bg-white/5">
                            <iframe
                                src={`/api/offer/${student._id}?preview=true#view=FitH&toolbar=0&navpanes=0`}
                                className="w-full h-full"
                                title="Offer Letter Preview"
                            />
                        </div>
                        <div className="p-4 border-t border-white/10 flex justify-end gap-4 bg-[#1a1635]">
                            <Button
                                variant="outline"
                                onClick={() => setShowOfferPreview(false)}
                                className="border-white/20 text-white hover:bg-white/10"
                            >
                                Close
                            </Button>
                            <Button
                                onClick={() => {
                                    handleSendEmail();
                                    setShowOfferPreview(false);
                                }}
                                disabled={emailMutation.isPending}
                                className="bg-purple-500 hover:bg-purple-600"
                            >
                                {emailMutation.isPending ? "Sending..." : "Send Email"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
