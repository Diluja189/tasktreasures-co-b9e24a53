import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatCard } from "@/components/shared/StatCard";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";

const users = [
  { id: "1", name: "Alex Richardson", email: "alex@company.com", role: "Admin", department: "Executive", status: "Active", joined: "2023-01-15" },
  { id: "2", name: "Sarah Chen", email: "sarah@company.com", role: "Manager", department: "Engineering", status: "Active", joined: "2023-03-20" },
  { id: "3", name: "James Wilson", email: "james@company.com", role: "Employee", department: "Engineering", status: "Active", joined: "2023-06-10" },
  { id: "4", name: "Emily Davis", email: "emily@company.com", role: "Employee", department: "Engineering", status: "Active", joined: "2023-07-01" },
  { id: "5", name: "Mike Chen", email: "mike@company.com", role: "Employee", department: "Backend", status: "Active", joined: "2023-08-15" },
  { id: "6", name: "Lisa Wang", email: "lisa@company.com", role: "Manager", department: "Data", status: "On Leave", joined: "2023-04-01" },
  { id: "7", name: "David Kim", email: "david@company.com", role: "Manager", department: "DevOps", status: "Active", joined: "2023-02-10" },
  { id: "8", name: "Anna Schmidt", email: "anna@company.com", role: "Employee", department: "Design", status: "Inactive", joined: "2024-01-20" },
];

const roleColors: Record<string, string> = {
  Admin: "bg-destructive/10 text-destructive", Manager: "bg-primary/10 text-primary", Employee: "bg-accent/10 text-accent",
};
const statusColors: Record<string, string> = {
  Active: "bg-success/10 text-success", "On Leave": "bg-warning/10 text-warning", Inactive: "bg-muted text-muted-foreground",
};

const columns = [
  { key: "name", label: "User", render: (u: any) => (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8"><AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-xs font-semibold">{u.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback></Avatar>
      <div>
        <p className="font-medium text-sm">{u.name}</p>
        <p className="text-[10px] text-muted-foreground">{u.email}</p>
      </div>
    </div>
  )},
  { key: "role", label: "Role", render: (u: any) => <Badge variant="outline" className={`text-[9px] ${roleColors[u.role]}`}>{u.role}</Badge> },
  { key: "department", label: "Department", render: (u: any) => <span className="text-xs">{u.department}</span> },
  { key: "status", label: "Status", render: (u: any) => <Badge variant="outline" className={`text-[9px] ${statusColors[u.status]}`}>{u.status}</Badge> },
  { key: "joined", label: "Joined", render: (u: any) => <span className="text-xs text-muted-foreground">{u.joined}</span> },
];

const UsersPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="User Directory"
      description="Manage all workforce members and access"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1"><Download className="h-3.5 w-3.5" /> Export</Button>
          <Button size="sm" className="text-xs gap-1"><Plus className="h-3.5 w-3.5" /> Add User</Button>
        </div>
      }
    />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Users} title="Total Users" value={users.length} change="All time" changeType="neutral" />
      <StatCard icon={UserCheck} title="Active" value={users.filter(u => u.status === "Active").length} change="Online now" changeType="positive" />
      <StatCard icon={UserX} title="Inactive" value={users.filter(u => u.status === "Inactive").length} changeType="neutral" />
      <StatCard icon={UserPlus} title="New This Month" value={2} change="+2 onboarding" changeType="positive" />
    </div>

    <DataTable
      columns={columns}
      data={users}
      searchKey="name"
      searchPlaceholder="Search users..."
      filterOptions={[
        { key: "role", label: "Role", options: ["Admin", "Manager", "Employee"] },
        { key: "status", label: "Status", options: ["Active", "On Leave", "Inactive"] },
      ]}
      exportable
      bulkActions
    />
  </div>
);

export default UsersPage;
