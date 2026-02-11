import { type ButtonHTMLAttributes, forwardRef } from "react";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "destructive";
    size?: "default" | "sm" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "glass-button flex items-center justify-center transition-all",
                    variant === "primary" && "bg-white/20 hover:bg-white/30",
                    variant === "secondary" && "bg-black/20 hover:bg-black/30",
                    variant === "outline" && "border border-white/20 hover:bg-white/5",
                    variant === "destructive" && "bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/50",
                    size === "default" && "h-10 px-4 py-2",
                    size === "sm" && "h-8 px-3 text-xs",
                    size === "lg" && "h-12 px-8",
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
