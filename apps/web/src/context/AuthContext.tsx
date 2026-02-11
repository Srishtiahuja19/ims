import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axios from "axios";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    token?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: User & { token?: string }) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = (userData: User & { token?: string }) => {
        setUser(userData);
        sessionStorage.setItem("ims_user", JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await axios.post("http://localhost:3001/api/auth/logout");
        } catch (error) {
            console.error("Logout failed", error);
        }
        setUser(null);
        sessionStorage.removeItem("ims_user");
        // Redirect logic should technically be component side, but generic reload works for now or let component handle it
        window.location.href = "/login";
    };

    const checkAuth = async () => {
        const storedUser = sessionStorage.getItem("ims_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
                sessionStorage.removeItem("ims_user");
            }
        }
        // Force re-check of legacy key just in case we are migrating from old session or user just closed tab
        // Actually, if we want strict tab isolation, we should NOT check localStorage for new tabs.
        // But for transition, let's leave it, but write to Session.
        const legacyAdmin = localStorage.getItem("admin_user") || localStorage.getItem("ims_user");
        if (legacyAdmin && !storedUser) {
            // Optional: Decide if we want to inherit the "main" session.
            // User wants SEPARATE sessions. So inheriting might defeat the purpose if they open a new tab.
            // BUT, usually "Open in new tab" should inherit logic? No, only cookies do that.
            // Let's NOT inherit from localStorage to ensure total isolation.
            // If they want to log in, they log in.
        }

        setIsLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
