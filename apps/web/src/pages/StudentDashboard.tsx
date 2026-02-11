import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/api';
import { CheckCircle, Clock, FileText, LayoutList, ShieldCheck, FileCheck } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Schema for Profile Form
const profileSchema = z.object({
    portfolio: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    github: z.string().url("Must be a valid URL").optional().or(z.literal(""))
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const StudentDashboard = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const { user, isLoading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'verification' | 'tasks' | 'password'>('verification');
    const [error, setError] = useState<string | null>(null);

    const effectiveStudentId = studentId || user?._id;

    // Fetch student data
    const fetchStudent = async () => {
        if (authLoading) return; // Wait for auth to be ready

        if (!effectiveStudentId) {
            console.log("No student ID found", { studentId, user });
            setLoading(false);
            return;
        }
        try {
            // Optimally we should have getStudentById endpoint, but using existing list for now
            const res = await api.get('/student');
            const found = res.data.data.find((s: any) => s._id === effectiveStudentId);
            if (found) {
                setStudent(found);
            } else {
                setError(`Student ID ${effectiveStudentId} not found in list.`);
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to fetch student data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            fetchStudent();
        }
    }, [effectiveStudentId, authLoading]);

    if (authLoading || loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    if (!student) return (
        <div className="p-10 text-center flex flex-col items-center">
            <p className="text-red-500 text-lg font-semibold">Student data not found.</p>
            <p className="text-gray-500 mb-4">Please try logging in again.</p>

            <div className="bg-gray-100 p-4 rounded text-left text-xs text-gray-700 max-w-md w-full font-mono overflow-auto">
                <p><strong>Debug Info:</strong></p>
                <p>User ID (Auth): {user ? user._id : 'null'}</p>
                <p>Effective ID: {effectiveStudentId || 'null'}</p>
                <p>Auth Loading: {authLoading ? 'yes' : 'no'}</p>
                <p>API Error: {error || 'None'}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Tabs Header */}
            <div className="bg-white shadow rounded-lg p-2 flex space-x-2">
                <button
                    onClick={() => setActiveTab('verification')}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'verification'
                        ? 'bg-black text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <FileCheck className="w-4 h-4 mr-2" />
                    Document Verification
                </button>
                <button
                    onClick={() => setActiveTab('tasks')}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'tasks'
                        ? 'bg-black text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <LayoutList className="w-4 h-4 mr-2" />
                    Tasks
                </button>
                <button
                    onClick={() => setActiveTab('password')}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'password'
                        ? 'bg-black text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Change Password
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'verification' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Onboarding Status Card */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Application Status</h2>
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-full ${student?.onboardingStatus === 'verified' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                    {student?.onboardingStatus === 'verified' ? <CheckCircle className="text-green-600" /> : <Clock className="text-yellow-600" />}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 capitalize">{student?.onboardingStatus || 'Pending'}</p>
                                    <p className="text-sm text-gray-500">
                                        {student?.onboardingStatus === 'verified' ? 'You are all set! Check your email for the offer.' : 'Please upload your documents for verification.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Document Uploads Grid */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Required Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {['aadhar', 'pan', '10th', '12th'].map((docName) => (
                                    <DocumentUploadCard
                                        key={docName}
                                        docName={docName}
                                        student={student}
                                        refreshStudent={fetchStudent}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}


                {activeTab === 'tasks' && (
                    <TasksTab student={student} effectiveStudentId={effectiveStudentId} fetchStudent={fetchStudent} />
                )}

                {activeTab === 'password' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ChangePasswordForm />
                    </div>
                )}
            </div>
        </div>
    );
};

// Tasks Tab Component
const TasksTab = ({ student, effectiveStudentId, fetchStudent }: { student: any, effectiveStudentId?: string, fetchStudent: () => void }) => {
    const [completing, setCompleting] = useState<number | null>(null);

    const handleCompleteTask = async (taskIndex: number) => {
        if (!effectiveStudentId) return;
        setCompleting(taskIndex);
        try {
            await api.patch(`/admin/complete-task/${effectiveStudentId}/${taskIndex}`);
            await fetchStudent(); // Refresh student data
        } catch (error) {
            console.error('Failed to complete task:', error);
            alert('Failed to mark task as complete');
        } finally {
            setCompleting(null);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Assigned Tasks</h2>
                {student?.tasks && student.tasks.length > 0 ? (
                    <div className="space-y-4">
                        {student.tasks.map((task: any, index: number) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${task.status === 'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {task.status}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Assigned: {new Date(task.assignedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 font-medium">{task.description}</p>
                                    </div>
                                    {task.status === 'pending' && (
                                        <button
                                            onClick={() => handleCompleteTask(index)}
                                            disabled={completing === index}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center gap-2 shrink-0"
                                        >
                                            {completing === index ? (
                                                <>Processing...</>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4" />
                                                    Mark Complete
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <LayoutList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No tasks assigned yet</p>
                        <p className="text-sm text-gray-400 mt-1">Your admin will assign tasks here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProfileDetailsForm = ({ student, studentId }: { student: any, studentId?: string }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            portfolio: student?.socialLinks?.portfolio || "",
            linkedin: student?.socialLinks?.linkedin || "",
            github: student?.socialLinks?.github || ""
        }
    });

    // Reset form when student data changes (e.g., on initial load or if student prop updates)
    useEffect(() => {
        if (student) {
            reset({
                portfolio: student.socialLinks?.portfolio || "",
                linkedin: student.socialLinks?.linkedin || "",
                github: student.socialLinks?.github || ""
            });
        }
    }, [student, reset]);

    const onProfileSubmit = async (data: ProfileFormValues) => {
        if (!studentId) return alert("No student ID found");
        try {
            await api.patch(`/student/${studentId}/profile`, {
                socialLinks: {
                    linkedin: data.linkedin,
                    github: data.github
                },
                portfolio: data.portfolio
            });
            alert("Profile updated!");
        } catch (e) {
            console.error(e);
            alert("Failed to update profile");
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Your Profile</h3>
            <p className="text-gray-500 text-sm mb-6">Please provide your professional links to complete the onboarding tasks.</p>
            <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Portfolio URL</label>
                    <input {...register('portfolio')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" placeholder="https://myportfolio.com" />
                    {errors.portfolio && <p className="text-red-500 text-xs mt-1">{errors.portfolio.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                    <input {...register('linkedin')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" placeholder="https://linkedin.com/in/..." />
                    {errors.linkedin && <p className="text-red-500 text-xs mt-1">{errors.linkedin.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                    <input {...register('github')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" placeholder="https://github.com/..." />
                    {errors.github && <p className="text-red-500 text-xs mt-1">{errors.github.message}</p>}
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors">
                    Save Details
                </button>
            </form>
        </div>
    );
}

const ChangePasswordForm = () => {
    const { user } = useAuth(); // Import useAuth from context
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const passwordSchema = z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

    type PasswordForm = z.infer<typeof passwordSchema>;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = async (data: PasswordForm) => {
        setIsLoading(true);
        setMessage(null);

        try {
            await api.put(
                "/auth/update-password",
                {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }
            );

            setMessage({ type: 'success', text: "Password updated successfully!" });
            reset();
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to update password";
            setMessage({ type: 'error', text: msg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>

            {message && (
                <div className={`p-3 rounded-md mb-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                        type="password"
                        {...register('currentPassword')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                    />
                    {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        {...register('newPassword')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                    />
                    {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                        type="password"
                        {...register('confirmPassword')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                    {isLoading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
};

const DocumentUploadCard = ({ docName, student, refreshStudent }: { docName: string, student: any, refreshStudent: () => void }) => {
    const [status, setStatus] = useState<{ type: 'idle' | 'uploading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
    const existingDoc = student?.documents?.find((d: any) => d.name === docName);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        if (!student?._id) {
            setStatus({ type: 'error', message: 'Student ID missing' });
            return;
        }

        setStatus({ type: 'uploading', message: 'Uploading...' });

        try {
            const formData = new FormData();
            formData.append('documentName', docName);
            formData.append('document', e.target.files[0]);

            await api.post(`/student/${student._id}/upload-document`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setStatus({ type: 'success', message: 'Uploaded successfully!' });
            refreshStudent();

            // Clear success message after 3 seconds
            setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);

        } catch (err: any) {
            console.error(err);
            setStatus({ type: 'error', message: err.response?.data?.message || err.message || 'Upload failed' });
        }
    };

    const statusColor = (status: string) => {
        if (status === 'approved') return 'text-green-600 bg-green-100 border-green-200';
        if (status === 'rejected') return 'text-red-600 bg-red-100 border-red-200';
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    };

    return (
        <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gray-50">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100">
                        <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 capitalize">{docName} Document</h4>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG (Max 5MB)</p>
                    </div>
                </div>
                {existingDoc && (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border capitalize ${statusColor(existingDoc.status)}`}>
                        {existingDoc.status}
                    </span>
                )}
            </div>

            {existingDoc?.rejectionReason && existingDoc.status === 'rejected' && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-100">
                    <strong>Reason:</strong> {existingDoc.rejectionReason}
                </div>
            )}

            <div className="flex items-center justify-between mt-4">
                {existingDoc?.url ? (
                    <a
                        href={`http://localhost:3001${existingDoc.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        View Document
                    </a>
                ) : <span />}

                {(!existingDoc || existingDoc.status === 'rejected' || existingDoc.status === 'pending') && ( // Allow re-upload even if pending just in case
                    <label className={`cursor-pointer inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${status.type === 'uploading' ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'} transition-colors`}>
                        {status.type === 'uploading' ? 'Uploading...' : (existingDoc ? 'Re-upload' : 'Upload')}
                        <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" disabled={status.type === 'uploading'} />
                    </label>
                )}
                {existingDoc?.status === 'approved' && (
                    <span className="text-xs text-green-600 font-medium flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified
                    </span>
                )}
            </div>
            {status.message && (
                <div className={`mt-2 text-xs ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                    {status.message}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
