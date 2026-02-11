import { useState, useEffect, type ReactNode } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { MobileBlocker } from "../components/common/MobileBlocker";
import { useAuth } from "../context/AuthContext";
import axios from "axios";



export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [colleges, setColleges] = useState<string[]>([]);
    const [selectedCollege, setSelectedCollege] = useState<string>("All Colleges");

    const location = useLocation();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchColleges();
    }, []);

    const fetchColleges = async () => {
        try {
            const res = await axios.get("http://localhost:3001/api/student");
            const students = res.data.data;
            const uniqueColleges = Array.from(new Set(students.map((s: any) => s.college))).sort() as string[];
            setColleges(uniqueColleges);
        } catch (error) {
            console.error("Failed to fetch colleges");
        }
    };

    if (isMobile) return <MobileBlocker />;

    return (
        <div className="flex h-screen bg-[#0f0c29]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-8">
                    IMS Admin
                </h1>

                <nav className="space-y-2 flex-1">
                    <NavLink to="/admin" active={location.pathname === "/admin"}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/students" active={location.pathname.includes("students")}>
                        Students
                    </NavLink>
                    <NavLink to="/admin/settings" active={location.pathname.includes("settings")}>
                        Settings
                    </NavLink>
                </nav>

                <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm overflow-hidden">
                            <p className="font-medium text-white truncate">{user?.email}</p>
                            <p className="text-white/50 text-xs capitalize">{user?.role || "Admin"}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full text-left text-xs text-red-400 hover:text-red-300 transition-colors px-1"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <span className="text-white/60 text-sm">Filter by College:</span>
                        <select
                            className="glass-input py-1 px-3 text-sm min-w-[200px]"
                            value={selectedCollege}
                            onChange={(e) => setSelectedCollege(e.target.value)}
                        >
                            <option value="All Colleges" className="bg-gray-900">All Colleges</option>
                            {colleges.map(college => (
                                <option key={college} value={college} className="bg-gray-900">
                                    {college}
                                </option>
                            ))}
                        </select>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-8 relative">
                    <Outlet context={{ selectedCollege }} />
                </div>
            </main>
        </div>
    );
}

function NavLink({ to, children, active }: { to: string, children: ReactNode, active: boolean }) {
    return (
        <Link
            to={to}
            className={`block px-4 py-2 rounded-lg transition-all ${active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
        >
            {children}
        </Link>
    )
}
