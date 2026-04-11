import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, TrendingDown, CheckCircle, Flag } from "lucide-react";

const risks = [
  { id: "RSK-001", title: "Mobile App deadline at risk", project: "Mobile App v3.0", severity: "Critical", probability: "High", impact: "Revenue delay of $50K/week", owner: "Sarah Chen", status: "Open", mitigation: "Add 2 resources from Data team", created: "Jun 20" },
  { id: "RSK-002", title: "Key developer resignation risk", project: "E-Commerce Platform", severity: "High", probability: "Medium", impact: "2-week knowledge transfer delay", owner: "Sarah Chen", status: "Monitoring", mitigation: "Cross-train team members", created: "Jun 18" },
  { id: "RSK-003", title: "Third-party API deprecation", project: "CRM Integration", severity: "Medium", probability: "High", impact: "Integration rework needed", owner: "David Kim", status: "Mitigating", mitigation: "Migrate to v3 API endpoints", created: "Jun 15" },
  { id: "RSK-004", title: "Budget overrun - Marketing", project: "Q3 Marketing Campaign", severity: "Low", probability: "Medium", impact: "$5K over budget", owner: "Jane Cooper", status: "Resolved", mitigation: "Reallocated from contingency", created: "Jun 10" },
];

const severityColors: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive", High: "bg-warning/10 text-warning",
  Medium: "bg-info/10 text-info", Low: "bg-muted text-muted-foreground",
};
const statusColors: Record<string, string> = {
  Open: "bg-destructive/10 text-destructive", Monitoring: "bg-warning/10 text-warning",
  Mitigating: "bg-info/10 text-info", Resolved: "bg-success/10 text-success",
};

const RisksPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Risk Monitor"
      description="Track and mitigate project risks"
      actions={<Button size="sm" className="text-xs gap-1"><Flag className="h-3.5 w-3.5" /> Flag Risk</Button>}
    />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={AlertTriangle} title="Open Risks" value={2} change="1 critical" changeType="negative" iconColor="bg-destructive/10" />
      <StatCard icon={Shield} title="Mitigating" value={1} change="In progress" changeType="neutral" />
      <StatCard icon={CheckCircle} title="Resolved" value={1} change="This month" changeType="positive" />
      <StatCard icon={TrendingDown} title="Risk Score" value="6.2" change="-0.8 vs last week" changeType="positive" />
    </div>

    <div className="space-y-3">
      {risks.map((risk) => (
        <div key={risk.id} className="glass-card rounded-xl p-5 hover:shadow-md transition-all">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${risk.severity === "Critical" ? "bg-destructive/10" : "bg-warning/10"}`}>
                <AlertTriangle className={`h-5 w-5 ${risk.severity === "Critical" ? "text-destructive" : "text-warning"}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-muted-foreground">{risk.id}</span>
                  <h4 className="font-semibold text-sm">{risk.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{risk.project} · Owner: {risk.owner}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-[9px] ${severityColors[risk.severity]}`}>{risk.severity}</Badge>
              <Badge variant="outline" className={`text-[9px] ${statusColors[risk.status]}`}>{risk.status}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-muted/30">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Impact</p>
              <p>{risk.impact}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Probability</p>
              <p>{risk.probability}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Mitigation</p>
              <p>{risk.mitigation}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RisksPage;
