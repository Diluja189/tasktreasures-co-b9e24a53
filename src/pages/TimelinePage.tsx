import { PageHeader } from "@/components/shared/PageHeader";

const TimelinePage = () => (
  <div className="space-y-6">
    <PageHeader title="Project Timeline" description="Visual timeline and Gantt chart view" />
    <div className="glass-card rounded-xl p-8">
      <div className="space-y-4">
        {[].map((p) => (
          <div key={p.name} className="flex items-center gap-4">
            <span className="text-sm font-medium w-44 shrink-0 truncate">{p.name}</span>
            <div className="flex-1 bg-muted rounded-full h-6 relative">
              <div className={`absolute h-6 rounded-full ${p.color} opacity-80 flex items-center px-3`} style={{ left: `${p.start}%`, width: `${p.width}%` }}>
                <span className="text-[10px] font-medium text-primary-foreground truncate">{p.width}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6 text-[10px] text-muted-foreground">
        {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((m) => <span key={m}>{m}</span>)}
      </div>
    </div>
  </div>
);

export default TimelinePage;
