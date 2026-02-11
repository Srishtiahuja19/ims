import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { Link, useOutletContext } from "react-router-dom";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    Users, UserCheck, UserX, Briefcase,
    TrendingUp, PieChart as PieChartIcon, BarChart3
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";

interface Student {
    _id: string;
    college: string;
    status: string;
    branch: string;
}

export default function DashboardOverview() {
    const { selectedCollege } = useOutletContext<{ selectedCollege: string }>();
    // Commenting out useOutletContext as AdminLayout doesn't provide context yet, defaulting.
    // const selectedCollege = "All Colleges";

    const { data: allStudents = [] } = useQuery({
        queryKey: ["students"],
        queryFn: async () => {
            const res = await api.get("/student"); // Match backend route
            return res.data.data;
        }
    });

    // 1. Filter Data
    const filteredStudents = useMemo(() => {
        if (selectedCollege === "All Colleges") return allStudents;
        return allStudents.filter((s: Student) => s.college === selectedCollege);
    }, [allStudents, selectedCollege]);

    // 2. Compute KPIs
    const kpi = useMemo(() => {
        const total = filteredStudents.length;
        const hired = filteredStudents.filter((s: Student) => s.status === "hired").length;
        const rejected = filteredStudents.filter((s: Student) => s.status.includes("rejected")).length;
        const active = total - hired - rejected;

        return { total, hired, rejected, active };
    }, [filteredStudents]);

    // 3. Compute Funnel Data
    const funnelData = useMemo(() => {
        const counts = {
            applied: 0,
            round1: 0,
            round2: 0,
            round3: 0,
            round4: 0,
            round5: 0,
            hired: 0
        };

        filteredStudents.forEach((s: Student) => {
            if (s.status === "applied") counts.applied++;
            if (s.status.includes("round1")) counts.round1++;
            if (s.status.includes("round2")) counts.round2++;
            if (s.status.includes("round3")) counts.round3++;
            if (s.status.includes("round4")) counts.round4++;
            if (s.status.includes("round5")) counts.round5++;
            if (s.status === "hired") counts.hired++;
        });

        // Funnel logic: Round 2 implies passed Round 1, etc.
        // Actually, status is singular. So we accumulate backwards? 
        // No, simplest view: "Current Status Distribution".
        // Better: "Funnel Flow" -> Everyone in Round 2 was in Round 1.
        // Let's just show "Current Stage" distribution for now.

        return [
            { name: "Applied", value: counts.applied },
            { name: "Round 1", value: counts.round1 },
            { name: "Round 2", value: counts.round2 },
            { name: "Round 3", value: counts.round3 },
            { name: "Round 4", value: counts.round4 },
            { name: "Round 5", value: counts.round5 },
            { name: "Hired", value: counts.hired },
        ];
    }, [filteredStudents]);

    // 4. Compute Branch Data
    const branchData = useMemo(() => {
        const map: Record<string, number> = {};
        filteredStudents.forEach((s: Student) => {
            const branch = s.branch || "Unknown";
            map[branch] = (map[branch] || 0) + 1;
        });

        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [filteredStudents]);

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

    // Animations
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Dashboard Overview</h2>
                <Link to="/admin/interns" className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500 transition-colors flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Manage Interns
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Applications"
                    value={kpi.total}
                    icon={Users}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                />
                <KPICard
                    title="Hired Candidates"
                    value={kpi.hired}
                    icon={UserCheck}
                    color="text-green-400"
                    bg="bg-green-500/10"
                />
                <KPICard
                    title="Rejected"
                    value={kpi.rejected}
                    icon={UserX}
                    color="text-red-400"
                    bg="bg-red-500/10"
                />
                <KPICard
                    title="Active in Process"
                    value={kpi.active}
                    icon={Briefcase}
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Funnel Chart */}
                <motion.div variants={item} className="lg:col-span-2 glass-card p-6 rounded-xl border border-white/10 bg-black/20">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                        Hiring Pipeline Status
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} />
                                <YAxis stroke="#ffffff60" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1635', borderColor: '#ffffff20', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                    {funnelData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Branch Distribution */}
                <motion.div variants={item} className="glass-card p-6 rounded-xl border border-white/10 bg-black/20">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5 text-pink-400" />
                        Branch Distribution
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={branchData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {branchData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1635', borderColor: '#ffffff20', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

function KPICard({ title, value, icon: Icon, color, bg, trend }: any) {
    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div variants={item} className="glass-card p-6 rounded-xl border border-white/10 bg-black/20">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-white/50 text-sm font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
                    {trend && <p className="text-green-400 text-xs mt-1 flex items-center gap-1"><TrendingUp size={12} /> {trend}</p>}
                </div>
                <div className={`p-3 rounded-lg ${bg}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
        </motion.div>
    );
}
