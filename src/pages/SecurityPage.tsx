import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Shield, Key, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const securityEvents = [
  { event: "Failed login attempt", user: "unknown@test.com", ip: "192.168.1.45", time: "2m ago", severity: "High" },
  { event: "Password changed", user: "james@company.com", ip: "10.0.0.12", time: "1h ago", severity: "Info" },
  { event: "New device login", user: "sarah@company.com", ip: "172.16.0.8", time: "3h ago", severity: "Medium" },
  { event: "API key rotated", user: "system", ip: "—", time: "5h ago", severity: "Info" },
];

const severityColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive", Medium: "bg-warning/10 text-warning",
  Low: "bg-info/10 text-info", Info: "bg-muted text-muted-foreground",
};

const SecurityPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Security Policies"
      description="Manage authentication, access control, and security settings"
      badge={<Badge className="bg-success/10 text-success border-success/20 text-[10px]"><CheckCircle className="h-2.5 w-2.5 mr-1" /> Secure</Badge>}
    />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Security Score", value: "94/100", icon: Shield, color: "text-success" },
        { label: "Active Sessions", value: "24", icon: Eye, color: "text-primary" },
        { label: "Failed Logins", value: "3", icon: AlertTriangle, color: "text-warning" },
        { label: "MFA Enabled", value: "92%", icon: Key, color: "text-accent" },
      ].map((s) => (
        <div key={s.label} className="stat-card">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><s.icon className="h-3.5 w-3.5" />{s.label}</div>
          <p className={`text-xl font-display font-bold ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> Security Settings</h3>
        <div className="space-y-4">
          {[
            "Enforce two-factor authentication",
            "Session timeout after 30 minutes",
            "Login audit logging",
            "IP-based access restrictions",
            "Password complexity rules",
            "Auto-lock after 5 failed attempts",
            "API rate limiting",
          ].map((setting) => (
            <div key={setting} className="flex items-center justify-between">
              <Label className="text-sm">{setting}</Label>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Recent Security Events</h3>
        <div className="space-y-2">
          {securityEvents.map((event, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className={`h-2 w-2 rounded-full shrink-0 ${event.severity === "High" ? "bg-destructive" : event.severity === "Medium" ? "bg-warning" : "bg-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{event.event}</p>
                <p className="text-[10px] text-muted-foreground">{event.user} · {event.ip}</p>
              </div>
              <div className="text-right shrink-0">
                <Badge variant="outline" className={`text-[8px] ${severityColors[event.severity]}`}>{event.severity}</Badge>
                <p className="text-[10px] text-muted-foreground mt-0.5">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SecurityPage;
