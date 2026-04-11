import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle, FileText, Clock } from "lucide-react";

const complianceItems = [
  { category: "Data Privacy", standard: "GDPR", status: "Compliant", lastAudit: "Jun 15, 2025", nextAudit: "Sep 15, 2025", score: 95 },
  { category: "Information Security", standard: "ISO 27001", status: "Compliant", lastAudit: "May 20, 2025", nextAudit: "Aug 20, 2025", score: 92 },
  { category: "Access Control", standard: "SOC 2 Type II", status: "In Progress", lastAudit: "Apr 10, 2025", nextAudit: "Jul 10, 2025", score: 78 },
  { category: "Business Continuity", standard: "ISO 22301", status: "Review Needed", lastAudit: "Mar 01, 2025", nextAudit: "Jun 30, 2025", score: 65 },
];

const statusColors: Record<string, string> = {
  Compliant: "bg-success/10 text-success", "In Progress": "bg-primary/10 text-primary",
  "Review Needed": "bg-warning/10 text-warning", "Non-Compliant": "bg-destructive/10 text-destructive",
};

const policies = [
  { name: "Data Retention Policy", lastUpdated: "Jun 2025", version: "v3.2", status: "Active" },
  { name: "Acceptable Use Policy", lastUpdated: "May 2025", version: "v2.1", status: "Active" },
  { name: "Incident Response Plan", lastUpdated: "Apr 2025", version: "v4.0", status: "Active" },
  { name: "Password Policy", lastUpdated: "Mar 2025", version: "v2.5", status: "Under Review" },
];

const CompliancePage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Compliance Center"
      description="Monitor regulatory compliance and audit readiness"
      badge={<Badge className="bg-success/10 text-success border-success/20 text-[10px]">2/4 Fully Compliant</Badge>}
    />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Compliance Score", value: "82%", icon: Shield, color: "text-primary" },
        { label: "Passed Audits", value: "2", icon: CheckCircle, color: "text-success" },
        { label: "Pending Reviews", value: "2", icon: AlertTriangle, color: "text-warning" },
        { label: "Active Policies", value: "4", icon: FileText, color: "text-info" },
      ].map((s) => (
        <div key={s.label} className="stat-card">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><s.icon className="h-3.5 w-3.5" />{s.label}</div>
          <p className={`text-xl font-display font-bold ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>

    {/* Compliance Items */}
    <div className="glass-card rounded-xl p-5">
      <h3 className="font-display font-semibold text-sm mb-4">Compliance Standards</h3>
      <div className="space-y-3">
        {complianceItems.map((item) => (
          <div key={item.category} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium">{item.category}</h4>
                <Badge variant="outline" className="text-[9px]">{item.standard}</Badge>
                <Badge variant="outline" className={`text-[9px] ${statusColors[item.status]}`}>{item.status}</Badge>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Last: {item.lastAudit}</span>
                <span>Next: {item.nextAudit}</span>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xl font-display font-bold ${item.score >= 90 ? "text-success" : item.score >= 75 ? "text-primary" : "text-warning"}`}>{item.score}%</p>
              <p className="text-[10px] text-muted-foreground">score</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Policies */}
    <div className="glass-card rounded-xl p-5">
      <h3 className="font-display font-semibold text-sm mb-4">Active Policies</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {policies.map((p) => (
          <div key={p.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
            <FileText className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{p.name}</p>
              <p className="text-[10px] text-muted-foreground">{p.version} · Updated {p.lastUpdated}</p>
            </div>
            <Badge variant="outline" className={`text-[8px] ${p.status === "Active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{p.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CompliancePage;
