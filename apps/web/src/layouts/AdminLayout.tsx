import { useState, useEffect, type ReactNode } from "react";
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Briefcase } from 'lucide-react';
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [colleges, setColleges] = useState<string[]>([]);
    const [selectedCollege, setSelectedCollege] = useState<string>("All Colleges");

    useEffect(() => {
        fetchColleges();
    }, []);

    const fetchColleges = async () => {
        try {
            const res = await api.get("/student");
            const students = res.data.data;
            const uniqueColleges = Array.from(new Set(students.map((s: any) => s.college))).sort() as string[];
            setColleges(uniqueColleges);
        } catch (error) {
            console.error("Failed to fetch colleges");
        }
    };

    return (
        <div className="flex h-screen bg-[#0f0c29]">
            {/* Sidebar - Exact match to DashboardLayout */}
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-8">
                    IMS Admin
                </h1>

                <nav className="space-y-2 flex-1">
                    <NavLink to="/admin" active={location.pathname === "/admin"} icon={<LayoutDashboard className="w-5 h-5 mr-3" />}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/students" active={location.pathname.includes("students")} icon={<Users className="w-5 h-5 mr-3" />}>
                        Students
                    </NavLink>
                    <NavLink to="/admin/interns" active={location.pathname.includes("interns")} icon={<Briefcase className="w-5 h-5 mr-3" />}>
                        Intern Management
                    </NavLink>

                    <NavLink to="/admin/settings" active={location.pathname.includes("settings")} icon={<Settings className="w-5 h-5 mr-3" />}>
                        Settings
                    </NavLink>
                </nav>

                <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                            {/* User Initials or Default */}
                            {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "A")}
                        </div>
                        <div className="text-sm overflow-hidden">
                            <p className="font-medium text-white truncate">{user?.name || user?.email || "Admin"}</p>
                            <p className="text-white/50 text-xs capitalize">{user?.role || "Admin"}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center w-full text-left text-xs text-red-400 hover:text-red-300 transition-colors px-1"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header - Exact match to DashboardLayout */}
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm">
                    <h2 className="text-white font-medium">Overview</h2>
                    {/* logic to show breadcrumbs or title could go here, but keeping college filter as requested */}
                    <div className="flex items-center gap-4">
                        <span className="text-white/60 text-sm">Filter by College:</span>
                        <select
                            className="bg-white/5 border border-white/10 rounded-lg py-1 px-3 text-sm min-w-[200px] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
};

function NavLink({ to, children, active, icon }: { to: string, children: ReactNode, active: boolean, icon: ReactNode }) {
    return (
        <Link
            to={to}
            className={`flex items-center px-4 py-2 rounded-lg transition-all ${active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
        >
            {icon}
            {children}
        </Link>
    )
}

export default AdminLayout;
