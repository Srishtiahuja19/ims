import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "./button"; // Reusing CN from button for now, should move to utils

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 w-full">
                {label && <label className="text-sm font-medium text-white/80">{label}</label>}
                <input
                    ref={ref}
                    className={cn(
                        "glass-input w-full",
                        error && "border-red-400 focus:ring-red-400",
                        className
                    )}
                    {...props}
                />
                {error && <span className="text-xs text-red-300">{error}</span>}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
