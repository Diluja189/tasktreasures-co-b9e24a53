import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";

const heatmapData = [
  { name: "James W.", data: [8, 7.5, 8.2, 6, 8, 7, 0, 8.5, 8, 7.8, 8.2, 6.5, 7, 0] },
  { name: "Emily D.", data: [7, 8, 7.5, 8, 7.2, 6.8, 0, 7.5, 8.2, 8, 7, 8.5, 7.2, 0] },
  { name: "Mike C.", data: [8.5, 8, 9, 8.2, 8, 7.5, 0, 8, 8.5, 7.8, 8, 9, 8.2, 0] },
  { name: "Lisa W.", data: [6, 7, 6.5, 5, 7, 6, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: "Tom H.", data: [8, 8, 7.5, 8, 8, 7, 0, 8, 7.5, 8, 8, 7.8, 8, 0] },
  { name: "Anna S.", data: [7, 6.5, 7, 7.5, 6, 5.5, 0, 7.2, 7, 6.8, 7.5, 7, 6.5, 0] },
];

const days = ["M", "T", "W", "T", "F", "S", "S", "M", "T", "W", "T", "F", "S", "S"];

const getColor = (value: number) => {
  if (value === 0) return "bg-muted/30";
  if (value < 6) return "bg-warning/20";
  if (value < 7.5) return "bg-primary/20";
  if (value < 8.5) return "bg-primary/40";
  return "bg-primary/70";
};

const HeatmapPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Productivity Heatmap"
      description="Visualize team productivity patterns across time"
      badge={<Badge variant="outline" className="text-[10px]">Last 2 Weeks</Badge>}
    />

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: "Avg Daily Hours", value: "7.4h", color: "text-primary" },
        { label: "Peak Day", value: "Thursday", color: "text-success" },
        { label: "Low Day", value: "Saturday", color: "text-warning" },
        { label: "Team Utilization", value: "82%", color: "text-accent" },
      ].map((s) => (
        <div key={s.label} className="stat-card text-center">
          <p className={`text-xl font-display font-bold ${s.color}`}>{s.value}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="glass-card rounded-xl p-5 overflow-x-auto">
      <h3 className="font-display font-semibold text-sm mb-4">Activity Heatmap</h3>
      
      <div className="min-w-[500px]">
        {/* Header */}
        <div className="flex items-center gap-1 mb-2 pl-24">
          {days.map((d, i) => (
            <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground font-medium">{d}</div>
          ))}
        </div>

        {/* Rows */}
        {heatmapData.map((row) => (
          <div key={row.name} className="flex items-center gap-1 mb-1">
            <span className="w-24 text-xs font-medium truncate shrink-0">{row.name}</span>
            {row.data.map((v, i) => (
              <div
                key={i}
                className={`flex-1 h-8 rounded-md ${getColor(v)} flex items-center justify-center transition-all hover:scale-110 cursor-pointer`}
                title={`${v}h`}
              >
                {v > 0 && <span className="text-[9px] font-medium">{v}</span>}
              </div>
            ))}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center gap-3 mt-4 pl-24 text-[10px] text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {["bg-muted/30", "bg-warning/20", "bg-primary/20", "bg-primary/40", "bg-primary/70"].map((c) => (
              <div key={c} className={`h-4 w-4 rounded ${c}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  </div>
);

export default HeatmapPage;
