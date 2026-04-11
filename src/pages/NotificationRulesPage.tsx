import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, AlertTriangle, CheckSquare, Clock, Save } from "lucide-react";

const notificationChannels = [
  { category: "Task Assignments", email: true, push: true, slack: false, description: "When a new task is assigned to you" },
  { category: "Deadline Reminders", email: true, push: true, slack: true, description: "24h and 1h before task deadlines" },
  { category: "Task Approvals", email: true, push: true, slack: false, description: "When tasks are approved or rejected" },
  { category: "Project Updates", email: false, push: true, slack: true, description: "Status changes on your projects" },
  { category: "Team Changes", email: true, push: false, slack: false, description: "When team members are added or removed" },
  { category: "Overdue Alerts", email: true, push: true, slack: true, description: "When tasks or milestones are overdue" },
  { category: "Weekly Digest", email: true, push: false, slack: false, description: "Weekly summary of team activity" },
  { category: "Security Alerts", email: true, push: true, slack: true, description: "Login attempts and security events" },
];

const NotificationRulesPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Notification Rules"
      description="Configure notification preferences and delivery channels"
      actions={<Button size="sm" className="text-xs gap-1"><Save className="h-3.5 w-3.5" /> Save Changes</Button>}
    />

    <div className="grid grid-cols-3 gap-4">
      {[
        { label: "Email", icon: Mail, count: 6, color: "text-primary" },
        { label: "Push", icon: Bell, count: 5, color: "text-accent" },
        { label: "Slack", icon: MessageSquare, count: 3, color: "text-info" },
      ].map((ch) => (
        <div key={ch.label} className="stat-card flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ch.icon className={`h-5 w-5 ${ch.color}`} />
          </div>
          <div>
            <p className="text-sm font-display font-bold">{ch.label}</p>
            <p className="text-[10px] text-muted-foreground">{ch.count} rules active</p>
          </div>
        </div>
      ))}
    </div>

    <div className="glass-card rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Notification</th>
            <th className="text-center p-4 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground w-20">
              <div className="flex items-center justify-center gap-1"><Mail className="h-3 w-3" /> Email</div>
            </th>
            <th className="text-center p-4 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground w-20">
              <div className="flex items-center justify-center gap-1"><Bell className="h-3 w-3" /> Push</div>
            </th>
            <th className="text-center p-4 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground w-20">
              <div className="flex items-center justify-center gap-1"><MessageSquare className="h-3 w-3" /> Slack</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {notificationChannels.map((rule) => (
            <tr key={rule.category} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
              <td className="p-4">
                <p className="text-sm font-medium">{rule.category}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{rule.description}</p>
              </td>
              <td className="text-center p-4"><Switch defaultChecked={rule.email} /></td>
              <td className="text-center p-4"><Switch defaultChecked={rule.push} /></td>
              <td className="text-center p-4"><Switch defaultChecked={rule.slack} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default NotificationRulesPage;
