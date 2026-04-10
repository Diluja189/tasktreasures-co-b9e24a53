import { PageHeader } from "@/components/shared/PageHeader";
import { Shield, Check, X } from "lucide-react";

const roles = [
  { role: "Admin", permissions: { users: true, projects: true, reports: true, settings: true, audit: true, departments: true, roles: true, approvals: true } },
  { role: "Manager", permissions: { users: false, projects: true, reports: true, settings: false, audit: false, departments: false, roles: false, approvals: true } },
  { role: "Employee", permissions: { users: false, projects: false, reports: false, settings: false, audit: false, departments: false, roles: false, approvals: false } },
];

const permissionLabels = ["users", "projects", "reports", "settings", "audit", "departments", "roles", "approvals"];

const RolesPage = () => (
  <div className="space-y-6">
    <PageHeader title="Roles & Permissions" description="Manage role-based access control" />
    <div className="glass-card rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 text-xs uppercase tracking-wider font-medium text-muted-foreground">Permission</th>
            {roles.map((r) => (
              <th key={r.role} className="text-center p-4 text-xs uppercase tracking-wider font-medium text-muted-foreground">{r.role}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissionLabels.map((p) => (
            <tr key={p} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
              <td className="p-4 text-sm capitalize font-medium">{p}</td>
              {roles.map((r) => (
                <td key={r.role} className="p-4 text-center">
                  {(r.permissions as any)[p] ? (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success/10"><Check className="h-3.5 w-3.5 text-success" /></span>
                  ) : (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted"><X className="h-3.5 w-3.5 text-muted-foreground" /></span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RolesPage;
