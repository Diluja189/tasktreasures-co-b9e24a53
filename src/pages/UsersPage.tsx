import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
      <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{u.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback></Avatar>
      <div>
        <p className="font-medium text-sm">{u.name}</p>
        <p className="text-xs text-muted-foreground">{u.email}</p>
      </div>
    </div>
  )},
  { key: "role", label: "Role", render: (u: any) => <Badge variant="outline" className={`text-[10px] ${roleColors[u.role]}`}>{u.role}</Badge> },
  { key: "department", label: "Department" },
  { key: "status", label: "Status", render: (u: any) => <Badge variant="outline" className={`text-[10px] ${statusColors[u.status]}`}>{u.status}</Badge> },
  { key: "joined", label: "Joined", render: (u: any) => <span className="text-xs text-muted-foreground">{u.joined}</span> },
];

const UsersPage = () => (
  <div className="space-y-6">
    <PageHeader title="User Management" description="Manage all system users" actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add User</Button>} />
    <DataTable columns={columns} data={users} searchKey="name" searchPlaceholder="Search users..." />
  </div>
);

export default UsersPage;
