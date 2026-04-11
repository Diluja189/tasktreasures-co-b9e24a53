import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, CheckCircle, ExternalLink, Plus, Zap, Database, Mail, MessageSquare } from "lucide-react";

const integrations = [
  { name: "Slack", description: "Team notifications and updates", icon: MessageSquare, status: "Connected", lastSync: "Just now", color: "bg-[#4A154B]/10 text-[#4A154B]" },
  { name: "GitHub", description: "Code repository sync", icon: Globe, status: "Connected", lastSync: "5m ago", color: "bg-[#24292F]/10 text-[#24292F]" },
  { name: "Google Workspace", description: "Calendar and email integration", icon: Mail, status: "Connected", lastSync: "15m ago", color: "bg-[#4285F4]/10 text-[#4285F4]" },
  { name: "Jira", description: "Issue tracking sync", icon: Zap, status: "Disconnected", lastSync: "—", color: "bg-[#0052CC]/10 text-[#0052CC]" },
  { name: "AWS", description: "Cloud infrastructure monitoring", icon: Database, status: "Connected", lastSync: "1h ago", color: "bg-[#FF9900]/10 text-[#FF9900]" },
  { name: "Stripe", description: "Payment and billing", icon: Globe, status: "Disconnected", lastSync: "—", color: "bg-[#635BFF]/10 text-[#635BFF]" },
];

const IntegrationsPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Integrations"
      description="Manage third-party service connections"
      actions={<Button size="sm" className="text-xs gap-1"><Plus className="h-3.5 w-3.5" /> Add Integration</Button>}
    />

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: "Total Integrations", value: "6" },
        { label: "Connected", value: "4" },
        { label: "Disconnected", value: "2" },
        { label: "API Calls Today", value: "2,847" },
      ].map((s) => (
        <div key={s.label} className="stat-card text-center">
          <p className="text-xl font-display font-bold">{s.value}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {integrations.map((integration) => (
        <div key={integration.name} className="glass-card rounded-xl p-5 hover:shadow-md transition-all group cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${integration.color}`}>
              <integration.icon className="h-5 w-5" />
            </div>
            <Badge variant="outline" className={`text-[9px] ${integration.status === "Connected" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
              {integration.status === "Connected" && <CheckCircle className="h-2.5 w-2.5 mr-1" />}
              {integration.status}
            </Badge>
          </div>
          <h4 className="font-display font-semibold text-sm">{integration.name}</h4>
          <p className="text-xs text-muted-foreground mt-1">{integration.description}</p>
          {integration.lastSync !== "—" && (
            <p className="text-[10px] text-muted-foreground mt-2">Last sync: {integration.lastSync}</p>
          )}
          <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="outline" size="sm" className="text-[10px] h-7 flex-1">
              {integration.status === "Connected" ? "Configure" : "Connect"}
            </Button>
            <Button variant="ghost" size="sm" className="text-[10px] h-7">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default IntegrationsPage;
