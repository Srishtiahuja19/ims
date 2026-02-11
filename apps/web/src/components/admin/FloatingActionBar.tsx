import { Check, X } from "lucide-react";
import { Button } from "../ui/button";

interface FloatingActionBarProps {
    selectedCount: number;
    onApprove: () => void;
    onReject: () => void;
    onClear: () => void;
    isLoading?: boolean;
}

export function FloatingActionBar({
    selectedCount,
    onApprove,
    onReject,
    onClear,
    isLoading = false,
}: FloatingActionBarProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 animate-in slide-in-from-bottom duration-300">
            <div className="glass-card px-6 py-4 flex items-center gap-4 shadow-2xl border-2 border-white/20">
                {/* Selected Count */}
                <div className="text-white font-semibold">
                    {selectedCount} selected
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-white/20" />

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        onClick={onApprove}
                        disabled={isLoading}
                        className="bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                    </Button>

                    <Button
                        onClick={onReject}
                        disabled={isLoading}
                        className="bg-red-500 hover:bg-red-600 text-white"
                        size="sm"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                    </Button>

                    <Button
                        onClick={onClear}
                        disabled={isLoading}
                        variant="secondary"
                        size="sm"
                    >
                        Clear
                    </Button>
                </div>
            </div>
        </div>
    );
}
