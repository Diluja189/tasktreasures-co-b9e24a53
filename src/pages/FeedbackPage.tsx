import { PageHeader } from "@/components/shared/PageHeader";
import { MessageSquare, CheckCircle, AlertCircle } from "lucide-react";

const feedback = [];

const statusColors: Record<string, string> = { Approved: "bg-success/10 text-success", Rework: "bg-warning/10 text-warning" };
const statusIcons: Record<string, any> = { Approved: CheckCircle, Rework: AlertCircle };

const FeedbackPage = () => (
  <div className="space-y-6">
    <PageHeader title="Feedback & Reviews" description="Manager feedback on your work" />
    <div className="space-y-4">
      {feedback.map((f, i) => {
        const Icon = statusIcons[f.status];
        return (
          <div key={i} className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon className={`h-4 w-4 ${f.status === "Approved" ? "text-success" : "text-warning"}`} />
              <span className="font-medium text-sm">{f.task}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded ${statusColors[f.status]}`}>{f.status}</span>
            </div>
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">{f.comment}</p>
            <p className="text-xs text-muted-foreground mt-2">— {f.manager} · {f.date}</p>
          </div>
        );
      })}
    </div>
  </div>
);

export default FeedbackPage;
