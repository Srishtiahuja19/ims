import { StudentGrid } from "../../components/admin/StudentGrid";

export default function StudentsPage() {
    return (
        <div className="h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-6 text-white">Application Funnel</h1>
            <div className="flex-1 min-h-0">
                <StudentGrid />
            </div>
        </div>
    )
}
