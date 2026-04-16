import { useRole } from "@/contexts/RoleContext";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { ManagerDashboard } from "@/components/dashboards/ManagerDashboard";
import { UserDashboard } from "@/components/dashboards/UserDashboard";

const Index = () => {
  const { currentUser } = useRole();
  if (currentUser.role === "admin") return <AdminDashboard />;
  if (currentUser.role === "manager") return <ManagerDashboard />;
  return <UserDashboard />;
};

export default Index;
