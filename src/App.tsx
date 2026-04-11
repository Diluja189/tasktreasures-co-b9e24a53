import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/contexts/RoleContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import ProjectsPage from "./pages/ProjectsPage";
import TasksPage from "./pages/TasksPage";
import UsersPage from "./pages/UsersPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import RolesPage from "./pages/RolesPage";
import ReportsPage from "./pages/ReportsPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import SettingsPage from "./pages/SettingsPage";
import TeamPage from "./pages/TeamPage";
import TimelinePage from "./pages/TimelinePage";
import ApprovalsPage from "./pages/ApprovalsPage";
import NotificationsPage from "./pages/NotificationsPage";
import WorkLogPage from "./pages/WorkLogPage";
import FilesPage from "./pages/FilesPage";
import FeedbackPage from "./pages/FeedbackPage";
import CapacityPage from "./pages/CapacityPage";
import OKRPage from "./pages/OKRPage";
import AIInsightsPage from "./pages/AIInsightsPage";
import HeatmapPage from "./pages/HeatmapPage";
import CompliancePage from "./pages/CompliancePage";
import SecurityPage from "./pages/SecurityPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import NotificationRulesPage from "./pages/NotificationRulesPage";
import SprintsPage from "./pages/SprintsPage";
import MilestonesPage from "./pages/MilestonesPage";
import WorkloadPage from "./pages/WorkloadPage";
import RisksPage from "./pages/RisksPage";
import ActivityLogPage from "./pages/ActivityLogPage";
import ProductivityPage from "./pages/ProductivityPage";
import LearningPage from "./pages/LearningPage";
import ActivityFeedPage from "./pages/ActivityFeedPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RoleProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/users" element={<UsersPage />} />
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
              <Route path="/capacity" element={<CapacityPage />} />
              <Route path="/okr" element={<OKRPage />} />
              <Route path="/ai-insights" element={<AIInsightsPage />} />
              <Route path="/heatmap" element={<HeatmapPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              <Route path="/notification-rules" element={<NotificationRulesPage />} />
              <Route path="/sprints" element={<SprintsPage />} />
              <Route path="/milestones" element={<MilestonesPage />} />
              <Route path="/workload" element={<WorkloadPage />} />
              <Route path="/risks" element={<RisksPage />} />
              <Route path="/activity-log" element={<ActivityLogPage />} />
              <Route path="/productivity" element={<ProductivityPage />} />
              <Route path="/learning" element={<LearningPage />} />
              <Route path="/activity-feed" element={<ActivityFeedPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
