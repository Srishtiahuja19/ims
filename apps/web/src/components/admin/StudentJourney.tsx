import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface StudentJourneyProps {
    status: string;
}

export function StudentJourney({ status }: StudentJourneyProps) {
    const steps = [
        { id: "round1", label: "Round 1" },
        { id: "round2", label: "Round 2" },
        { id: "round3", label: "Round 3" },
        { id: "round4", label: "Round 4" },
        { id: "round5", label: "Round 5" },
        { id: "hired", label: "Hired" },
    ];

    const currentStepIndex = useMemo(() => {
        if (status === "hired") return 5;
        if (status === "applied") return 0;
        if (status.includes("round1")) return 0;
        if (status.includes("round2")) return 1;
        if (status.includes("round3")) return 2;
        if (status.includes("round4")) return 3;
        if (status.includes("round5")) return 4;
        return -1;
    }, [status]);

    const isRejected = status.includes("rejected");

    return (
        <div className="w-full py-6 px-4 bg-white/5 rounded-xl border border-white/10 mb-6">
            <div className="flex items-center justify-between relative">
                {/* Progress Bar Background */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 -z-10" />

                {steps.map((step, index) => {
                    let stepStatus = "pending"; // pending, current, completed, rejected

                    if (index < currentStepIndex) {
                        stepStatus = "completed";
                    } else if (index === currentStepIndex) {
                        stepStatus = isRejected ? "rejected" : "current";
                    }

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-[#1a1635] px-2 z-10">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${stepStatus === "completed" ? "bg-green-500/20 border-green-500 text-green-500" :
                                    stepStatus === "rejected" ? "bg-red-500/20 border-red-500 text-red-500" :
                                        stepStatus === "current" ? "bg-purple-500/20 border-purple-500 text-purple-400 animate-pulse" :
                                            "border-white/20 text-white/20"
                                    }`}
                            >
                                {stepStatus === "completed" ? <CheckCircle2 size={20} /> :
                                    stepStatus === "rejected" ? <XCircle size={20} /> :
                                        <span className="text-sm font-bold">{index + 1}</span>}
                            </div>
                            <span className={`text-xs font-medium ${stepStatus === "completed" ? "text-green-500" :
                                stepStatus === "rejected" ? "text-red-500" :
                                    stepStatus === "current" ? "text-purple-400" :
                                        "text-white/30"
                                }`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {isRejected && (
                <div className="mt-4 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                        <XCircle size={14} />
                        Candidate Rejected in {steps[currentStepIndex]?.label || "Process"}
                    </span>
                </div>
            )}
        </div>
    );
}
