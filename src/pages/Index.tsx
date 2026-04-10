import { useRole } from "@/contexts/RoleContext";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { ManagerDashboard } from "@/components/dashboards/ManagerDashboard";
import { EmployeeDashboard } from "@/components/dashboards/EmployeeDashboard";

const Index = () => {
  const { currentUser } = useRole();
  if (currentUser.role === "admin") return <AdminDashboard />;
  if (currentUser.role === "manager") return <ManagerDashboard />;
  return <EmployeeDashboard />;
};

export default Index;
