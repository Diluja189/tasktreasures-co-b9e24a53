import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  trend?: number[];
  className?: string;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor, trend, className }: StatCardProps) {
  return (
    <div className={cn("stat-card animate-fade-in group", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-display font-bold mt-1.5 tracking-tight">{value}</p>
          {change && (
            <p className={cn("text-xs mt-1.5 font-medium flex items-center gap-1",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {changeType === "positive" && "↑"}
              {changeType === "negative" && "↓"}
              {change}
            </p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-xl transition-all group-hover:scale-110", iconColor || "bg-primary/10")}>
          <Icon className={cn("h-5 w-5", iconColor ? "text-current" : "text-primary")} />
        </div>
      </div>
      {trend && (
        <div className="flex items-end gap-[2px] mt-3 h-6">
          {trend.map((v, i) => (
            <div key={i} className="flex-1 bg-primary/20 rounded-t-sm transition-all" style={{ height: `${(v / Math.max(...trend)) * 100}%` }} />
          ))}
        </div>
      )}
    </div>
  );
}
