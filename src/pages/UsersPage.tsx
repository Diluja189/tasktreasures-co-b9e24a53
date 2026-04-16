import { useState } from "react";
import { 
  Users, Plus, Search, Filter, MoreHorizontal, Mail, Phone, 
  MapPin, Calendar, Shield, UserCircle, RefreshCw, Download,
  Activity, Award, Star, TrendingUp, MoreVertical, Edit2, Trash2, ArrowUpRight
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const teamMembers = [
  { 
    id: "1", 
    name: "James Wilson", 
    role: "manager", 
    email: "james.w@tasktreasure.co", 
    department: "Engineering", 
    status: "Active", 
    efficiency: "94%", 
    tasks: 12, 
    joined: "Jan 2023",
    color: "indigo"
  },
  { 
    id: "2", 
    name: "Sarah Chen", 
    role: "user", 
    email: "sarah.c@tasktreasure.co", 
    department: "UI/UX Design", 
    status: "Working", 
    efficiency: "88%", 
    tasks: 8, 
    joined: "Mar 2023",
    color: "emerald"
  },
  { 
    id: "3", 
    name: "Mike Jones", 
    role: "user", 
    email: "mike.j@tasktreasure.co", 
    department: "Backend", 
    status: "Active", 
    efficiency: "91%", 
    tasks: 15, 
    joined: "Feb 2023",
    color: "blue"
  },
  { 
    id: "4", 
    name: "Emily Davis", 
    role: "manager", 
    email: "emily.d@tasktreasure.co", 
    department: "DevOps", 
    status: "On Leave", 
    efficiency: "0%", 
    tasks: 0, 
    joined: "May 2023",
    color: "amber"
  },
];

const roleLabels: Record<string, { label: string, color: string, bg: string }> = {
  admin: { label: "Administrator", color: "text-rose-600", bg: "bg-rose-500/10" },
  manager: { label: "Project Manager", color: "text-indigo-600", bg: "bg-indigo-500/10" },
  user: { label: "Team Member", color: "text-emerald-600", bg: "bg-emerald-500/10" },
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Team Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">Manage human resources and cross-departmental efficiency.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Refreshing member list...")}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export Data
          </Button>
          <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
            <Plus className="h-4 w-4" /> Add Member
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-3xl border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email or role..." 
            className="pl-10 h-10 border-none bg-secondary/50 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="secondary" className="rounded-xl flex-1 md:flex-none gap-2">
            <Filter className="h-4 w-4" /> User Filters
          </Button>
          <div className="h-10 p-1 bg-secondary/50 rounded-xl flex gap-1">
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"} 
              size="icon" 
              className="h-8 w-8 rounded-lg"
              onClick={() => setViewMode("grid")}
            >
              <Users className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="icon" 
              className="h-8 w-8 rounded-lg"
              onClick={() => setViewMode("list")}
            >
              <Activity className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-xl transition-all duration-500 rounded-3xl">
                <CardHeader className="p-6 pb-2 relative">
                  <div className="absolute top-6 right-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl border-none shadow-2xl p-2">
                        <DropdownMenuItem className="gap-2 rounded-xl py-2 cursor-pointer focus:bg-indigo-500/5 focus:text-indigo-600">
                          <Edit2 className="h-4 w-4" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 rounded-xl py-2 cursor-pointer focus:bg-indigo-500/5 focus:text-indigo-600">
                          <Shield className="h-4 w-4" /> Permissions
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 opacity-50" />
                        <DropdownMenuItem className="gap-2 rounded-xl py-2 cursor-pointer focus:bg-rose-500/5 focus:text-rose-600 text-rose-500">
                          <Trash2 className="h-4 w-4" /> Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex flex-col items-center text-center space-y-3 pt-2">
                    <div className="relative">
                      <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
                        <AvatarFallback className={`${roleLabels[member.role].bg} ${roleLabels[member.role].color} text-xl font-bold`}>
                          {member.name.split(" ").map(n=>n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white ${member.status === 'On Leave' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-indigo-600 transition-colors">{member.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-0.5">
                        <UserCircle className="h-3 w-3" /> {member.department}
                      </p>
                    </div>
                    <Badge variant="outline" className={`border-none font-bold text-[10px] uppercase tracking-wider ${roleLabels[member.role].bg} ${roleLabels[member.role].color}`}>
                      {roleLabels[member.role].label}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-secondary/30 p-3 rounded-2xl text-center">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Efficiency</p>
                      <p className="text-lg font-bold text-indigo-600">{member.efficiency}</p>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-2xl text-center">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Tasks</p>
                      <p className="text-lg font-bold">{member.tasks}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" /> {member.email}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> Joined {member.joined}
                    </div>
                  </div>

                  <Button variant="secondary" className="w-full mt-6 rounded-2xl text-xs font-bold gap-2 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 border-none shadow-sm">
                    View Full Analytics <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-md bg-indigo-600 text-white rounded-3xl overflow-hidden relative">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <TrendingUp size={160} />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Top Performance</CardTitle>
            <CardDescription className="text-indigo-100/70">Highest throughput this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
                   <span className="text-sm font-medium">Mike Jones</span>
                </div>
                <Badge className="bg-white/20 text-white border-none font-bold">98% Score</Badge>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
                   <span className="text-sm font-medium">James Wilson</span>
                </div>
                <Badge className="bg-white/20 text-white border-none font-bold">96% Score</Badge>
             </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Department Strength</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex flex-wrap gap-4">
               {["Backend", "UI/UX", "Project Management", "Marketing", "Customer Support"].map(dept => (
                 <div key={dept} className="px-4 py-2 bg-secondary/50 rounded-2xl flex items-center gap-2 border border-primary/5">
                   <Award className="h-4 w-4 text-indigo-600" />
                   <span className="text-sm font-semibold">{dept}</span>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
