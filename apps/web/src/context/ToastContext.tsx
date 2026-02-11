import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            min-w-[300px] p-4 rounded-lg shadow-lg border border-white/10 flex items-center gap-3 animate-in slide-in-from-right-full duration-300
                            ${toast.type === "success" ? "bg-green-600 text-white border-green-700" : ""}
                            ${toast.type === "error" ? "bg-red-600 text-white border-red-700" : ""}
                            ${toast.type === "info" ? "bg-blue-600 text-white border-blue-700" : ""}
                            shadow-xl
                        `}
                    >
                        {toast.type === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                        {toast.type === "error" && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                        {toast.type === "info" && <Info className="w-5 h-5 flex-shrink-0" />}

                        <p className="text-sm font-medium flex-1">{toast.message}</p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="hover:bg-white/10 p-1 rounded transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
