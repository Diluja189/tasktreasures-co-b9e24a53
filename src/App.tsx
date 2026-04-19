import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/contexts/RoleContext";
import { AppLayout } from "@/components/layout/AppLayout";

// Standard Pages
import Index from "@/pages/Index";
import ProjectsPage from "@/pages/ProjectsPage";
import TasksPage from "@/pages/TasksPage";
import UsersPage from "@/pages/UsersPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import RolesPage from "@/pages/RolesPage";
import ReportsPage from "@/pages/ReportsPage";
import AuditLogsPage from "@/pages/AuditLogsPage";
import SettingsPage from "@/pages/SettingsPage";
import TeamPage from "@/pages/TeamPage";
import TimelinePage from "@/pages/TimelinePage";
import ApprovalsPage from "@/pages/ApprovalsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import WorkLogPage from "@/pages/WorkLogPage";
import FilesPage from "@/pages/FilesPage";
import FeedbackPage from "@/pages/FeedbackPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AssignManagerPage from "@/pages/AssignManagerPage";
import MonitoringPage from "@/pages/MonitoringPage";
import ManagersPage from "@/pages/ManagersPage";
// import PerformancePage from "@/pages/PerformancePage";


// Manager Pages
import ManagerProjectsPage from "@/pages/manager/ManagerProjectsPage";
import ManagerTasksPage from "@/pages/manager/ManagerTasksPage";
import TeamAssignmentPage from "@/pages/manager/TeamAssignmentPage";
import ProgressTrackingPage from "@/pages/manager/ProgressTrackingPage";
import StatusReportsPage from "@/pages/manager/StatusReportsPage";
import ManagerDetailedAuditPage from "@/pages/manager/ManagerDetailedAuditPage";

// Team Member Pages
import MemberTasksPage from "@/pages/member/MemberTasksPage";
import TimeTrackingPage from "@/pages/member/TimeTrackingPage";
import TaskUpdatesPage from "@/pages/member/TaskUpdatesPage";

import SetPasswordPage from "@/pages/SetPasswordPage";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RoleProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                {/* Core & Admin Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/assign-manager" element={<AssignManagerPage />} />
                <Route path="/monitoring" element={<MonitoringPage />} />
                <Route path="/managers" element={<ManagersPage />} />


                
                {/* Manager Specific Routes */}
                <Route path="/manager/projects" element={<ManagerProjectsPage />} />
                <Route path="/manager/tasks" element={<ManagerTasksPage />} />
                <Route path="/manager/assignments" element={<TeamAssignmentPage />} />
                <Route path="/manager/tracking" element={<ProgressTrackingPage />} />
                <Route path="/manager/reports" element={<StatusReportsPage />} />
                <Route path="/manager/notifications" element={<NotificationsPage />} />
                <Route path="/manager/audit" element={<ManagerDetailedAuditPage />} />

                {/* Team Member Specific Routes */}
                <Route path="/member/tasks" element={<MemberTasksPage />} />
                <Route path="/member/time" element={<TimeTrackingPage />} />
                <Route path="/member/updates" element={<TaskUpdatesPage />} />
                
                {/* Miscellaneous System Routes */}
                <Route path="/departments" element={<DepartmentsPage />} />
                <Route path="/roles" element={<RolesPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/audit-logs" element={<AuditLogsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/approvals" element={<ApprovalsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/work-log" element={<WorkLogPage />} />
                <Route path="/files" element={<FilesPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/set-password" element={<SetPasswordPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </RoleProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
