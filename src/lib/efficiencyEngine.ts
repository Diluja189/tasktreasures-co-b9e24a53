// ─────────────────────────────────────────────────────────────────────────────
// Efficiency Engine — Dynamic Efficiency Calculations
// All calculations are based on real-time localStorage data.
// No hardcoded values. Recalculates whenever called.
// ─────────────────────────────────────────────────────────────────────────────

export interface ProjectEfficiency {
  projectName: string;
  efficiency: number;         // 0–∞ (can exceed 100 if ahead of schedule)
  actualProgress: number;     // %
  expectedProgress: number;   // %
  status: "On Track" | "Moderate" | "At Risk";
  statusColor: "emerald" | "amber" | "rose";
}

export interface ManagerEfficiency {
  managerName: string;
  efficiency: number;
  projectCount: number;
  projectBreakdown: ProjectEfficiency[];
  status: "On Track" | "Moderate" | "At Risk";
  statusColor: "emerald" | "amber" | "rose";
}

export interface MemberEfficiency {
  memberName: string;
  assignedTasks: number;
  completedTasks: number;
  overdueTasks: number;
  efficiency: number;         // 0–100
  status: "On Track" | "Moderate" | "At Risk";
  statusColor: "emerald" | "amber" | "rose";
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function daysBetween(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24);
}

function getStatusFromEfficiency(eff: number): {
  status: "On Track" | "Moderate" | "At Risk";
  statusColor: "emerald" | "amber" | "rose";
} {
  if (eff >= 100) return { status: "On Track", statusColor: "emerald" };
  if (eff >= 80)  return { status: "Moderate", statusColor: "amber" };
  return { status: "At Risk", statusColor: "rose" };
}

// ── 1. Project Efficiency ─────────────────────────────────────────────────────

export function calcProjectEfficiency(project: any, allTasks: any[]): ProjectEfficiency {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate  = parseDate(project.startDate || project.createdDate || project.start);
  const deadlineDate = parseDate(project.deadline || project.endDate);

  // Get tasks for this project from the global task ledger
  const projectTasks = allTasks.filter(
    t => (t.project || "").toLowerCase() === (project.name || "").toLowerCase()
  );

  const totalTasks    = projectTasks.length;
  const completedTasks = projectTasks.filter(
    t => t.status === "Completed" || t.dynamicStatus === "Completed"
  ).length;

  // Actual progress
  const actualProgress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  // Expected progress from timeline
  let expectedProgress = 0;
  if (startDate && deadlineDate) {
    const totalDays = daysBetween(startDate, deadlineDate);
    const daysUsed  = daysBetween(startDate, today);
    if (totalDays > 0) {
      expectedProgress = Math.min(100, Math.max(0, (daysUsed / totalDays) * 100));
    }
  }

  // Efficiency
  let efficiency = 0;
  if (expectedProgress > 0) {
    efficiency = (actualProgress / expectedProgress) * 100;
  } else if (expectedProgress === 0 && actualProgress > 0) {
    // Started before expected — ahead of schedule
    efficiency = 100;
  }

  const rounded = Math.round(efficiency * 100) / 100;
  const { status, statusColor } = getStatusFromEfficiency(rounded);

  return {
    projectName: project.name,
    efficiency: rounded,
    actualProgress: Math.round(actualProgress * 100) / 100,
    expectedProgress: Math.round(expectedProgress * 100) / 100,
    status,
    statusColor,
  };
}

// ── 2. Manager Efficiency ─────────────────────────────────────────────────────

export function calcManagerEfficiency(manager: any, allProjects: any[], allTasks: any[]): ManagerEfficiency {
  const assignedProjects = allProjects.filter(
    p => (p.manager || "").toLowerCase() === (manager.name || "").toLowerCase()
  );

  if (assignedProjects.length === 0) {
    return {
      managerName: manager.name,
      efficiency: 0,
      projectCount: 0,
      projectBreakdown: [],
      status: "At Risk",
      statusColor: "rose",
    };
  }

  const breakdown = assignedProjects.map(p => calcProjectEfficiency(p, allTasks));
  const avgEfficiency = breakdown.reduce((sum, b) => sum + b.efficiency, 0) / breakdown.length;
  const rounded = Math.round(avgEfficiency * 100) / 100;
  const { status, statusColor } = getStatusFromEfficiency(rounded);

  return {
    managerName: manager.name,
    efficiency: rounded,
    projectCount: assignedProjects.length,
    projectBreakdown: breakdown,
    status,
    statusColor,
  };
}

// ── 3. Team Member Efficiency ─────────────────────────────────────────────────

export function calcMemberEfficiency(memberName: string, allTasks: any[]): MemberEfficiency {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const memberTasks = allTasks.filter(
    t => (t.assignee || "").toLowerCase() === memberName.toLowerCase()
  );

  const assignedTasks  = memberTasks.length;
  const completedTasks = memberTasks.filter(
    t => t.status === "Completed" || t.dynamicStatus === "Completed"
  ).length;
  const overdueTasks = memberTasks.filter(t => {
    if (t.status === "Completed" || t.dynamicStatus === "Completed") return false;
    const dl = parseDate(t.deadline);
    return dl ? today > dl : false;
  }).length;

  if (assignedTasks === 0) {
    return {
      memberName,
      assignedTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
      efficiency: 0,
      status: "At Risk",
      statusColor: "rose",
    };
  }

  const completionRate = (completedTasks / assignedTasks) * 100;
  // Overdue penalty: each overdue task reduces efficiency proportionally
  const overduePenalty = (overdueTasks / assignedTasks) * 100 * 0.5; // 50% weight penalty
  const rawEfficiency  = completionRate - overduePenalty;
  const efficiency     = Math.min(100, Math.max(0, Math.round(rawEfficiency * 100) / 100));

  const { status, statusColor } = getStatusFromEfficiency(efficiency);

  return {
    memberName,
    assignedTasks,
    completedTasks,
    overdueTasks,
    efficiency,
    status,
    statusColor,
  };
}

// ── 4. Load all data from localStorage ───────────────────────────────────────

export function loadEfficiencyData() {
  const projects = JSON.parse(localStorage.getItem("app_projects_persistence") || "[]");
  const managers = JSON.parse(localStorage.getItem("app_managers_persistence") || "[]");
  const tasks    = JSON.parse(localStorage.getItem("app_tasks_persistence") || "[]");
  return { projects, managers, tasks };
}
