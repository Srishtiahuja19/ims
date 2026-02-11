import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AdminLayout from './layouts/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import StudentsPage from './pages/admin/StudentsPage';
import InternManagementPage from './pages/admin/InternManagementPage';
import SettingsPage from './pages/admin/SettingsPage';
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/StudentDashboard';
import Registration from './pages/Registration';
import LoginPage from './pages/admin/LoginPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<LoginPage />} />

              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="interns" element={<InternManagementPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Student Routes */}
              <Route path="/student" element={<StudentLayout />}>
                <Route path="dashboard/:studentId" element={<StudentDashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
