export function MobileBlocker() {
    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-4">
                <h1 className="text-3xl font-bold text-red-500">Device Not Supported</h1>
                <p className="text-white/70">
                    The Admin Dashboard is optimized for Desktop use only. Please access this page on a larger screen (Laptop/PC).
                </p>
            </div>
        </div>
    );
}
