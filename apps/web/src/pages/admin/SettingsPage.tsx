import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2, ShieldCheck, KeyRound } from "lucide-react";

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
    const { user } = useAuth(); // Get user (with token) from context
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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
        setSuccessMessage("");
        setErrorMessage("");

        try {
            await axios.put(
                "http://localhost:3001/api/auth/update-password",
                {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            setSuccessMessage("✅ Password updated successfully! Please login again next time.");
            reset();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || "Failed to update password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <ShieldCheck className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Account Security</h1>
                    <p className="text-white/60">Manage your password and security settings</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Security Info */}
                <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <KeyRound className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Password Requirements</h3>
                        <ul className="text-sm text-white/50 space-y-2 list-disc pl-4">
                            <li>Minimum 6 characters</li>
                            <li>Include numbers & symbols recommended</li>
                            <li>Must differ from previous password</li>
                        </ul>
                    </div>
                </div>

                {/* Password Form */}
                <div className="lg:col-span-2">
                    <div className="bg-[#1a1635] rounded-xl border border-white/10 p-8">
                        <h2 className="text-lg font-semibold text-white mb-6">Change Password</h2>

                        {successMessage && (
                            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                                {successMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Current Password</label>
                                <Input
                                    {...register("currentPassword")}
                                    type="password"
                                    className="bg-white/5 border-white/10 text-white"
                                />
                                {errors.currentPassword && (
                                    <p className="text-xs text-red-400">{errors.currentPassword.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">New Password</label>
                                    <Input
                                        {...register("newPassword")}
                                        type="password"
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                    {errors.newPassword && (
                                        <p className="text-xs text-red-400">{errors.newPassword.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">Confirm New Password</label>
                                    <Input
                                        {...register("confirmPassword")}
                                        type="password"
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white min-w-[150px]"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        "Update Password"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
