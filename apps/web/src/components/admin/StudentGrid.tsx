import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
    type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import api from "../../lib/api"; // Shared Client
import { useToast } from "../../context/ToastContext";
import { Input } from "../ui/input";
import { Loader2, ArrowUpDown, Mail } from "lucide-react"; // Added Mail
import { StudentProfileSheet } from "./StudentProfileSheet";
import { FloatingActionBar } from "./FloatingActionBar";

// TODO: Share this type from packages/types
interface Student {
    _id: string;
    name: string;
    email: string;
    phone: string;
    rollNo: string;
    college: string;
    branch: string;
    status: string;
    resumeUrl: string;
    onboardingStatus?: string; // Added for creds logic
    ratings: Array<{
        round: string;
        rating: number;
        notes: string;
        interviewerId: string;
    }>;
}

const columnHelper = createColumnHelper<Student>();

import { useOutletContext } from "react-router-dom";

// ... (existing imports)

export function StudentGrid() {
    const { selectedCollege } = useOutletContext<{ selectedCollege: string }>();
    // const selectedCollege = "All Colleges";
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentTab, setCurrentTab] = useState("Registered");
    const [actionLoading, setActionLoading] = useState<string | null>(null); // For send creds

    const rounds = ["Registered", "Round 1", "Round 2", "Round 3", "Round 4", "Round 5", "Selected", "Rejected"];

    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { data: allStudents = [], isLoading } = useQuery({
        queryKey: ["students"],
        queryFn: async () => {
            const res = await api.get("/student"); // Use shared API
            return res.data.data;
        },
    });

    // Send Credentials Action
    const handleSendCredentials = async (studentId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActionLoading(studentId);
        try {
            const res = await api.post('/student/send-credentials', { studentIds: [studentId] });
            const message = res.data.data?.message || "Credentials sent successfully!";
            showToast(message, "success");
            // Invalidate to update status
            queryClient.invalidateQueries({ queryKey: ["students"] });
        } catch (error: any) {
            console.error("Failed to send credentials", error);
            const msg = error.response?.data?.message || error.response?.data?.data?.message || "Failed to send credentials.";
            showToast(msg, "error");
        } finally {
            setActionLoading(null);
        }
    };

    const students = useMemo(() => {
        return allStudents.filter((student: Student) => {
            // College Filter
            if (selectedCollege !== "All Colleges" && student.college !== selectedCollege) {
                return false;
            }

            if (currentTab === "Registered") {
                return true; // Show all students
            }

            // Status Filter logic
            if (currentTab === "Rejected") {
                return student.status.includes("rejected") || student.status === "rejected";
            }

            if (currentTab === "Selected") {
                return student.status === "hired";
            }

            // For active rounds, show pending/selected/interviewed but NOT rejected
            // Also show "applied" in Round 1
            const roundPrefix = currentTab.toLowerCase().replace(" ", ""); // "round1", "round2"

            if (currentTab === "Round 1") {
                return (student.status === "applied" || (student.status.startsWith("round1") && !student.status.includes("rejected")));
            }

            return student.status.startsWith(roundPrefix) && !student.status.includes("rejected");
        });
    }, [allStudents, currentTab, selectedCollege]);

    // Bulk update mutation
    const bulkUpdateMutation = useMutation({
        mutationFn: async ({ studentIds, status }: { studentIds: string[], status: string }) => {
            const res = await api.patch("/student/bulk-update", { // Shared API
                studentIds,
                status,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
            setSelectedIds([]);
        },
        onError: (error: any) => {
            const responseData = error.response?.data;

            // Check for validation error (promotion gate)
            if (responseData?.data?.validation) {
                showToast(responseData.data.validation, "error");
            } else {
                showToast("Failed to update students", "error");
            }
        },
    });

    const handleBulkApprove = () => {
        // Validation: Ensure all selected students have been rated for the current round
        // We only enforce this for active interviewing rounds (Round 1-5)
        if (currentTab.startsWith("Round") && currentTab !== "Round 1") {
            const unratedStudents = selectedIds.filter(id => {
                const student = students.find((s: Student) => s._id === id);
                if (!student) return false;

                const hasRating = student.ratings?.some(r => r.round === currentTab);
                return !hasRating;
            });

            if (unratedStudents.length > 0) {
                showToast(`Cannot promote! ${unratedStudents.length} selected candidate(s) have not been rated for ${currentTab}.`, "error");
                return;
            }
        }

        let nextStatus = "";
        if (currentTab === "Round 1") nextStatus = "round2_pending";
        else if (currentTab === "Round 2") nextStatus = "round3_pending";
        else if (currentTab === "Round 3") nextStatus = "round4_pending";
        else if (currentTab === "Round 4") nextStatus = "round5_pending";
        else if (currentTab === "Round 5") nextStatus = "hired";

        if (nextStatus) {
            bulkUpdateMutation.mutate({ studentIds: selectedIds, status: nextStatus });
        }
    };

    const handleBulkReject = () => {
        // Determine specific rejection status based on current tab
        let rejectStatus = "rejected";
        const roundPrefix = currentTab.toLowerCase().replace(" ", ""); // "round1", "round2"

        if (currentTab === "Round 1") rejectStatus = "round1_rejected";
        else if (currentTab === "Round 2") rejectStatus = "round2_rejected";
        else if (currentTab === "Round 3") rejectStatus = "round3_rejected";
        else if (currentTab === "Round 4") rejectStatus = "round4_rejected";
        else if (currentTab === "Round 5") rejectStatus = "round5_rejected";

        bulkUpdateMutation.mutate({ studentIds: selectedIds, status: rejectStatus });
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === students.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(students.map((s: Student) => s._id));
        }
    };

    const columns = useMemo<ColumnDef<Student>[]>( // Explicit typing
        () => {
            const baseColumns: ColumnDef<Student>[] = [ // Explicit typing
                columnHelper.accessor("name", {
                    header: "Name",
                    cell: (info) => <span className="font-medium text-white">{info.getValue()}</span>,
                }),
                columnHelper.accessor("rollNo", {
                    header: "Roll No",
                    cell: (info) => info.getValue(),
                }),
                columnHelper.accessor("college", {
                    header: "College",
                    cell: (info) => <span className="text-white/70">{info.getValue()}</span>,
                }),
                columnHelper.accessor("branch", {
                    header: "Branch",
                    cell: (info) => info.getValue(),
                }),
                columnHelper.accessor("status", {
                    header: "Status",
                    cell: (info) => (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                  ${info.getValue() === "applied" ? "bg-blue-500/20 text-blue-300" : ""}
                  ${info.getValue().includes("selected") ? "bg-green-500/20 text-green-300" : ""}
                  ${info.getValue().includes("rejected") ? "bg-red-500/20 text-red-300" : ""}
               `}>
                            {info.getValue().replace("_", " ").toUpperCase()}
                        </span>
                    ),
                }),
            ];

            // Add Actions Column for "Selected" tab
            if (currentTab === "Selected") {
                baseColumns.push(columnHelper.display({
                    id: "actions",
                    header: "Actions",
                    cell: (props) => {
                        const student = props.row.original;
                        const isPending = student.onboardingStatus === 'pending';
                        const isVerified = student.onboardingStatus === 'verified';
                        const isLoading = actionLoading === student._id;

                        return (
                            <button
                                onClick={(e) => handleSendCredentials(student._id, e)}
                                disabled={isPending || isVerified || isLoading}
                                className={`flex items-center px-3 py-1.5 text-xs rounded border transition-colors
                                ${(!isPending && !isVerified)
                                        ? 'border-purple-500 bg-purple-500/20 text-purple-300 hover:bg-purple-500/40'
                                        : 'border-white/10 text-white/30 cursor-not-allowed bg-white/5'
                                    }`}
                                title={isPending ? "Creds Sent" : isVerified ? "Verified" : "Send Credentials"}
                            >
                                {isLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Mail className="w-3 h-3 mr-1" />}
                                {isVerified ? 'Verified' : isPending ? 'Sent' : 'Send Creds'}
                            </button>
                        );
                    }
                }));
            }

            // Only add selection column for active rounds
            if (!["Selected", "Rejected", "Registered"].includes(currentTab)) {
                baseColumns.unshift(
                    columnHelper.display({
                        id: "select",
                        header: () => (
                            <input
                                type="checkbox"
                                checked={selectedIds.length === students.length && students.length > 0}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 cursor-pointer"
                            />
                        ),
                        cell: ({ row }) => (
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(row.original._id)}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    toggleSelection(row.original._id);
                                }}
                                className="w-4 h-4 cursor-pointer"
                            />
                        ),
                    })
                );
            }

            return baseColumns;
        },
        [selectedIds, students, toggleSelectAll, toggleSelection, currentTab, actionLoading]
    );

    const table = useReactTable({
        data: students,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: "includesString", // Explicitly set filter function
    });

    const parentRef = useRef<HTMLDivElement>(null);

    const { rows } = table.getRowModel();

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 50, // Estimate row height
        overscan: 10,
    });

    if (isLoading) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-purple-400" /></div>
    }

    return (
        <div className="space-y-4 h-full flex flex-col">
            {/* Round Tabs */}
            <div className="flex space-x-2 border-b border-white/10 pb-2 overflow-x-auto">
                {rounds.map((round) => (
                    <button
                        key={round}
                        onClick={() => {
                            setCurrentTab(round);
                            setSelectedIds([]); // Clear selection when switching tabs
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${currentTab === round
                            ? "bg-purple-600 text-white"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        {round}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center">
                <Input
                    placeholder="Search by name, email, or roll no..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm border-white/10 bg-white/5 text-white placeholder-white/30"
                />
                <div className="text-sm text-white/50">
                    {students.length} candidates in <span className="text-white font-bold">{currentTab}</span>
                </div>
            </div>

            {/* Virtual Table */}
            <div
                ref={parentRef}
                className="flex-1 overflow-auto border border-white/10 rounded-xl bg-black/20 backdrop-blur-md relative"
            >
                <div
                    style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}
                >
                    {/* Header (Sticky) */}
                    <div className="sticky top-0 z-10 bg-[#1a1635] flex border-b border-white/10 font-semibold text-sm text-white/70">
                        {table.getHeaderGroups().map((headerGroup) => (
                            headerGroup.headers.map((header) => (
                                <div
                                    key={header.id}
                                    className="p-3 cursor-pointer hover:text-white flex items-center gap-2"
                                    style={{ flex: 1 }}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {{
                                        asc: <ArrowUpDown className="w-3 h-3 rotate-180" />,
                                        desc: <ArrowUpDown className="w-3 h-3" />,
                                    }[header.column.getIsSorted() as string] ?? <ArrowUpDown className="w-3 h-3 opacity-20" />}
                                </div>
                            ))
                        ))}
                    </div>

                    {/* Rows (Virtual) */}
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const row = rows[virtualRow.index];
                        return (
                            <div
                                key={row.id}
                                className="absolute top-0 left-0 w-full flex border-b border-white/5 hover:bg-white/5 transition-colors text-sm cursor-pointer"
                                style={{
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start + 45}px)`,
                                }}
                                onClick={(e) => {
                                    // Don't open profile if clicking checkbox
                                    const target = e.target as HTMLElement;
                                    if (target instanceof HTMLInputElement && target.type === 'checkbox') return;
                                    setSelectedStudentId(row.original._id);
                                }}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <div key={cell.id} className="p-3 flex items-center" style={{ flex: 1 }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                ))}
                            </div>
                        )
                    })}

                    {rows.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-white/30">
                            No students found.
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Sheet */}
            <StudentProfileSheet
                student={allStudents.find((s: Student) => s._id === selectedStudentId) || null}
                isOpen={!!selectedStudentId}
                onClose={() => setSelectedStudentId(null)}
            />

            {/* Floating Action Bar */}
            {!["Selected", "Rejected", "Registered"].includes(currentTab) && (
                <FloatingActionBar
                    selectedCount={selectedIds.length}
                    onApprove={handleBulkApprove}
                    onReject={handleBulkReject}
                    onClear={() => setSelectedIds([])}
                    isLoading={bulkUpdateMutation.isPending}
                />
            )}
        </div>
    );
}
