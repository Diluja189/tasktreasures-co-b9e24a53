import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award, Clock, TrendingUp, Plus, Star } from "lucide-react";

const skills = [
  { name: "React / TypeScript", level: "Advanced", progress: 88, hours: 120 },
  { name: "Node.js / Express", level: "Intermediate", progress: 65, hours: 80 },
  { name: "PostgreSQL", level: "Intermediate", progress: 60, hours: 45 },
  { name: "Docker / K8s", level: "Beginner", progress: 30, hours: 20 },
  { name: "AWS Services", level: "Beginner", progress: 25, hours: 15 },
];

const courses = [
  { title: "Advanced React Patterns", provider: "Frontend Masters", progress: 75, status: "In Progress", duration: "8h" },
  { title: "System Design Fundamentals", provider: "educative.io", progress: 40, status: "In Progress", duration: "12h" },
  { title: "TypeScript Deep Dive", provider: "Udemy", progress: 100, status: "Completed", duration: "6h" },
  { title: "AWS Solutions Architect", provider: "AWS Training", progress: 0, status: "Planned", duration: "40h" },
];

const certifications = [
  { name: "AWS Certified Developer", date: "Mar 2025", status: "Active" },
  { name: "Google Professional Cloud", date: "Jan 2025", status: "Active" },
];

const levelColors: Record<string, string> = {
  Advanced: "bg-success/10 text-success", Intermediate: "bg-primary/10 text-primary", Beginner: "bg-warning/10 text-warning",
};

const statusColors: Record<string, string> = {
  "In Progress": "bg-primary/10 text-primary", Completed: "bg-success/10 text-success", Planned: "bg-muted text-muted-foreground",
};

const LearningPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Learning Tracker"
      description="Track your skills development and learning path"
      actions={<Button size="sm" className="text-xs gap-1"><Plus className="h-3.5 w-3.5" /> Add Course</Button>}
    />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { icon: BookOpen, label: "Courses Active", value: "2", change: "In progress", type: "neutral" as const },
        { icon: Clock, label: "Hours Learned", value: "280h", change: "+12h this month", type: "positive" as const },
        { icon: Award, label: "Certifications", value: "2", change: "2 active", type: "positive" as const },
        { icon: TrendingUp, label: "Skill Score", value: "72%", change: "+5% this quarter", type: "positive" as const },
      ].map((s) => (
        <div key={s.label} className="stat-card">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><s.icon className="h-3.5 w-3.5" />{s.label}</div>
          <p className="text-xl font-display font-bold">{s.value}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{s.change}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Skills */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2"><Star className="h-4 w-4 text-primary" /> Skill Matrix</h3>
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.name} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">{skill.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[8px] ${levelColors[skill.level]}`}>{skill.level}</Badge>
                  <span className="text-[10px] text-muted-foreground">{skill.hours}h</span>
                </div>
              </div>
              <Progress value={skill.progress} className="h-1.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Courses */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> Learning Path</h3>
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course.title} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{course.title}</span>
                <Badge variant="outline" className={`text-[8px] ${statusColors[course.status]}`}>{course.status}</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">{course.provider} · {course.duration}</p>
              {course.progress > 0 && (
                <div className="flex items-center gap-2">
                  <Progress value={course.progress} className="flex-1 h-1" />
                  <span className="text-[10px] font-semibold">{course.progress}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Certifications */}
    <div className="glass-card rounded-xl p-5">
      <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Certifications</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {certifications.map((cert) => (
          <div key={cert.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-success/20">
            <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Award className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium">{cert.name}</p>
              <p className="text-[10px] text-muted-foreground">Earned {cert.date} · {cert.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LearningPage;
