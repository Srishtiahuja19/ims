
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import {
    CheckCircle, Clock, FileText, UserCheck, Search, Filter,
    MoreVertical, ShieldCheck, Mail, Briefcase, XCircle, Eye
} from 'lucide-react';
import { useForm } from 'react-hook-form';

// ... existing interfaces

interface Task {
    description: string;
    status: 'pending' | 'completed';
    assignedAt: string;
}

interface StudentDocument {
    name: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
}

interface Student {
    _id: string;
    name: string;
    email: string;
    onboardingStatus: string;
    resumeUrl: string;
    socialLinks?: {
        linkedin?: string;
        github?: string;
        portfolio?: string;
    };
    documents?: StudentDocument[];
    tasks?: Task[];
}

const InternManagementPage = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);

    // Fetch Interns
    const { data: interns = [], isLoading } = useQuery({
        queryKey: ['interns'],
        queryFn: async () => {
            const res = await api.get('/admin/interns');
            return res.data.data;
        }
    });

    const selectedStudent = useMemo(() =>
        interns.find((s: Student) => s._id === selectedStudentId) || null
        , [interns, selectedStudentId]);

    // Verify Mutation
    const verifyMutation = useMutation({
        mutationFn: async (studentId: string) => {
            await api.patch(`/admin/verify-docs/${studentId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interns'] });
            alert("Documents verified successfully!");
        },
        onError: () => alert("Failed to verify documents.")
    });

    // Assign Task Mutation
    const assignTaskMutation = useMutation({
        mutationFn: async ({ studentId, description }: { studentId: string, description: string }) => {
            await api.post(`/admin/assign-task/${studentId}`, { description });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interns'] });
            setIsTaskModalOpen(false);
            alert("Task assigned successfully!");
        },
        onError: () => alert("Failed to assign task.")
    });

    // Review Document Mutation
    const reviewDocMutation = useMutation({
        mutationFn: async ({ studentId, documentName, status, rejectionReason }: { studentId: string, documentName: string, status: string, rejectionReason?: string }) => {
            await api.patch(`/admin/review-doc/${studentId}`, { documentName, status, rejectionReason });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interns'] });
            // alert("Document status updated!"); // Removed alert to avoid blocking UI
        },
        onError: (err: any) => alert(err.response?.data?.message || "Failed to update document.")
    });

    // Filter Logic
    const filteredInterns = useMemo(() => {
        return interns.filter((student: Student) => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === "all" || student.onboardingStatus === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [interns, searchTerm, filterStatus]);

    const handleAssignTask = (description: string) => {
        if (selectedStudent) {
            assignTaskMutation.mutate({ studentId: selectedStudent._id, description });
        }
    };

    if (isLoading) return <div className="p-8 text-white">Loading interns...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Intern Management</h1>
                    <p className="text-white/60">Manage tasks and verify documents for hired interns.</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Interns Grid */}
            <div className="grid grid-cols-1 gap-4">
                {filteredInterns.map((student: Student) => (
                    <div key={student._id} className="glass-card p-6 rounded-xl border border-white/10 bg-black/20 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Student Info - Takes 5 columns */}
                        <div className="md:col-span-5 flex items-start gap-4 overflow-hidden">
                            <div className="p-3 bg-purple-500/10 rounded-full shrink-0">
                                <UserCheck className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-lg font-semibold text-white truncate">{student.name}</h3>
                                <p className="text-white/60 text-sm flex items-center gap-2 truncate" title={student.email}>
                                    <Mail className="w-3 h-3 shrink-0" /> {student.email}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase border ${student.onboardingStatus === 'verified' || student.onboardingStatus === 'Verified'
                                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                        : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {student.onboardingStatus === 'verified' || student.onboardingStatus === 'Verified' ? 'VERIFIED' : 'PENDING'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions - Takes 3 columns */}
                        <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center gap-2">
                            {/* Review Documents Action */}
                            <button
                                onClick={() => { setSelectedStudentId(student._id); setIsDocModalOpen(true); }}
                                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-colors text-sm whitespace-nowrap"
                            >
                                <FileText className="w-3 h-3" /> Review Docs ({student.documents?.length || 0})
                            </button>

                            {/* Verification Action */}
                            {student.onboardingStatus !== 'verified' && (
                                <button
                                    onClick={() => verifyMutation.mutate(student._id)}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors text-sm whitespace-nowrap"
                                >
                                    <CheckCircle className="w-3 h-3" /> Final Verify
                                </button>
                            )}

                            {/* Assign Task Action */}
                            <button
                                onClick={() => { setSelectedStudentId(student._id); setIsTaskModalOpen(true); }}
                                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-lg hover:bg-purple-600/30 transition-colors text-sm whitespace-nowrap"
                            >
                                <Clock className="w-3 h-3" /> Assign Task
                            </button>
                        </div>

                        {/* Recent Tasks - Takes 4 columns */}
                        <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                            <h4 className="text-sm font-medium text-white/80 mb-2">Active Tasks</h4>
                            {student.tasks && student.tasks.length > 0 ? (
                                <ul className="space-y-1">
                                    {student.tasks.slice(-2).reverse().map((task, i) => (
                                        <li key={i} className="text-xs text-white/60 flex items-center gap-2 truncate">
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                            <span className="truncate">{task.description}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="text-sm text-white/40 italic">No tasks assigned</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Document Review Modal */}
            {isDocModalOpen && selectedStudent && (
                <DocumentReviewModal
                    student={selectedStudent}
                    onClose={() => setIsDocModalOpen(false)}
                    onReview={(docName, status, reason) => reviewDocMutation.mutate({ studentId: selectedStudent._id, documentName: docName, status, rejectionReason: reason })}
                />
            )}

            {/* Task Modal */}
            {isTaskModalOpen && selectedStudent && (
                <TaskAssignmentModal
                    student={selectedStudent}
                    onClose={() => setIsTaskModalOpen(false)}
                    onAssign={handleAssignTask}
                />
            )}
        </div>
    );
};

const DocumentReviewModal = ({ student, onClose, onReview }: { student: Student, onClose: () => void, onReview: (doc: string, status: string, reason?: string) => void }) => {
    const requiredDocs = ['aadhar', 'pan', '10th', '12th'];

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1635] border border-white/10 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white">Review Documents: {student.name}</h3>
                    <button onClick={onClose} className="text-white/60 hover:text-white"><XCircle /></button>
                </div>

                <div className="space-y-4">
                    {requiredDocs.map((docName) => {
                        const doc = student.documents?.find(d => d.name === docName);
                        return (
                            <div key={docName} className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                                <div>
                                    <h4 className="text-white font-medium capitalize">{docName} Card</h4>
                                    <p className="text-xs text-white/50">
                                        Status: <span className={`uppercase font-bold ${doc?.status === 'approved' ? 'text-green-400' : doc?.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>
                                            {doc?.status || 'Missing'}
                                        </span>
                                    </p>
                                    {doc?.url && (
                                        <a href={`http://localhost:3001${doc.url}`} target="_blank" rel="noreferrer" className="text-blue-400 text-xs hover:underline flex items-center gap-1 mt-1">
                                            <Eye className="w-3 h-3" /> View File
                                        </a>
                                    )}
                                </div>

                                {doc ? (
                                    <div className="flex flex-col gap-2 w-full md:w-auto">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onReview(docName, 'approved')}
                                                className={`px-3 py-1 text-xs rounded border transition-colors ${doc.status === 'approved' ? 'bg-green-600 text-white border-green-600' : 'border-green-600/50 text-green-400 hover:bg-green-600/20'}`}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const reason = prompt("Enter rejection reason:");
                                                    if (reason) onReview(docName, 'rejected', reason);
                                                }}
                                                className={`px-3 py-1 text-xs rounded border transition-colors ${doc.status === 'rejected' ? 'bg-red-600 text-white border-red-600' : 'border-red-600/50 text-red-400 hover:bg-red-600/20'}`}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                        {doc.rejectionReason && (
                                            <p className="text-red-400 text-xs italic">Reason: {doc.rejectionReason}</p>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-white/30 text-xs italic">Not uploaded yet</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ... TaskAssignmentModal

const TaskAssignmentModal = ({ student, onClose, onAssign }: { student: Student, onClose: () => void, onAssign: (desc: string) => void }) => {
    const { register, handleSubmit, reset } = useForm<{ description: string }>();

    const onSubmit = (data: { description: string }) => {
        onAssign(data.description);
        reset();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1635] border border-white/10 rounded-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-white mb-4">Assign Task to {student.name}</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="text-sm text-white/60 block mb-1">Task Description</label>
                        <textarea
                            {...register('description', { required: true })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 min-h-[100px]"
                            placeholder="e.g. Complete profile details"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-white/60 hover:text-white">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg">Assign</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InternManagementPage;
