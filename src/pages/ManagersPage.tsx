import { useState } from "react";
import { 
  Plus, Search, Filter, RefreshCw, MoreVertical, 
  UserCircle, FolderKanban, Star, TrendingUp, 
  Mail, Phone, Shield, Edit2, Trash2, ArrowUpRight,
  Target, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const managers = [
  { 
    id: "M1", 
    name: "Sarah Chen", 
    email: "sarah@company.com", 
    projects: 4, 
    score: 94, 
    status: "Active", 
    specialty: "Agile / Scrum", 
    joined: "Jan 2023",
    avatar: "SC"
  },
  { 
    id: "M2", 
    name: "David Kim", 
    email: "david@company.com", 
    projects: 2, 
    score: 88, 
    status: "Peak Load", 
    specialty: "Infrastructure", 
    joined: "Mar 2023",
    avatar: "DK"
  },
  { 
    id: "M3", 
    name: "Lisa Wang", 
    email: "lisa@company.com", 
    projects: 3, 
    score: 91, 
    status: "Active", 
    specialty: "Product Design", 
    joined: "Feb 2023",
    avatar: "LW"
  },
  { 
    id: "M4", 
    name: "John Miller", 
    email: "john@company.com", 
    projects: 5, 
    score: 82, 
    status: "Delayed", 
    specialty: "Frontend", 
    joined: "May 2023",
    avatar: "JM"
  },
];

export default function ManagersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = managers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent italic">
             Manager Leadership Management
           </h1>
           <p className="text-muted-foreground mt-1">Audit and organize the leadership layer of the strategic operation.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Syncing leader scores...")}>
              <RefreshCw className="h-4 w-4" /> Sync Scores
           </Button>
           <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-bold border-none transition-all active:scale-95">
              <Plus className="h-4 w-4" /> Add Leader
           </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-3xl border shadow-sm">
         <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search leaders by name..." 
              className="pl-10 h-10 border-none bg-background rounded-xl shadow-none focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-3 w-full lg:w-auto">
            <Button variant="secondary" className="h-10 rounded-xl px-4 gap-2 flex-1 lg:flex-none">
               <Filter className="h-4 w-4" /> Filters
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
         <AnimatePresence>
            {filtered.map((manager, i) => (
              <motion.div 
                key={manager.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                 <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm group hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden relative">
                    <CardHeader className="pb-2 relative pt-6 text-center flex flex-col items-center">
                       <div className="absolute top-4 right-4">
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                   <MoreVertical className="h-4 w-4" />
                                </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="w-56 rounded-2xl border-none shadow-2xl p-2">
                                <DropdownMenuItem className="gap-2 rounded-xl py-2 cursor-pointer focus:bg-indigo-500/5 focus:text-indigo-600">
                                   <Edit2 className="h-4 w-4" /> Edit Leader
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 rounded-xl py-2 cursor-pointer focus:bg-indigo-500/5 focus:text-indigo-600">
                                   <Shield className="h-4 w-4" /> Permissions
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1 opacity-50" />
                                <DropdownMenuItem className="gap-2 rounded-xl py-2 cursor-pointer focus:bg-rose-500/5 focus:text-rose-600 text-rose-500">
                                   <Trash2 className="h-4 w-4" /> Delete Leader
                                </DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </div>
                       
                       <div className="relative mb-3">
                          <Avatar className="h-20 w-20 border-4 border-white shadow-xl ring-2 ring-indigo-500/10">
                             <AvatarFallback className="bg-gradient-to-br from-indigo-500/20 to-primary/20 text-indigo-700 font-bold text-xl uppercase tracking-widest">{manager.avatar}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${manager.status === 'Delayed' ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} title={manager.status} />
                       </div>
                       
                       <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors cursor-pointer" title={manager.name}>{manager.name}</CardTitle>
                       <CardDescription className="flex items-center gap-1.5 mt-0.5">
                          <Target className="h-3 w-3" /> {manager.specialty}
                       </CardDescription>
                       <Badge variant="outline" className={`mt-3 border-none font-bold text-[10px] uppercase tracking-widest ${manager.status === 'Delayed' ? 'bg-rose-500/10 text-rose-600' : (manager.status === 'Peak Load' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600')}`}>
                          {manager.status}
                       </Badge>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                       <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="bg-secondary/30 p-4 rounded-2xl text-center border border-secondary/20">
                             <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Projects</p>
                             <div className="flex items-center justify-center gap-1">
                                <FolderKanban className="h-3 w-3 text-indigo-500" />
                                <span className="text-xl font-bold">{manager.projects}</span>
                             </div>
                          </div>
                          <div className="bg-secondary/30 p-4 rounded-2xl text-center border border-secondary/20">
                             <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Efficiency</p>
                             <div className="flex items-center justify-center gap-1">
                                <Award className="h-3 w-3 text-emerald-500" />
                                <span className="text-xl font-bold">{manager.score}%</span>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-3 pt-2">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1 px-1">
                             <Mail className="h-3.5 w-3.5" /> <span className="truncate">{manager.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1 px-1">
                             <Shield className="h-3.5 w-3.5" /> Senior Lead
                          </div>
                       </div>

                       <Button variant="secondary" className="w-full h-11 rounded-2xl text-xs font-bold gap-2 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm border-none">
                          In-depth Review <ArrowUpRight className="h-4 w-4" />
                       </Button>
                    </CardContent>
                 </Card>
              </motion.div>
            ))}
         </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="border-none shadow-md bg-indigo-600 text-white rounded-3xl overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 opacity-10">
               <TrendingUp size={160} />
            </div>
            <CardHeader>
               <CardTitle className="text-lg font-bold">Manager Performance Scorecards</CardTitle>
               <CardDescription className="text-indigo-100/70">Top operational leaders this quarter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {[1, 2].map(i => (
                 <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                       <Star className="h-4 w-4 text-amber-300" />
                       <span className="text-sm font-bold">{i === 1 ? 'Sarah Chen' : 'Lisa Wang'}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold border-white/20 bg-emerald-500/20 text-emerald-100 border-none">{i === 1 ? '98%' : '95%'}</Badge>
                 </div>
               ))}
               <Button variant="outline" className="w-full rounded-2xl h-10 border-white/20 hover:bg-white/20 transition-all font-bold gap-2 text-xs border-dashed text-white">
                 View Full Leaderboard <TrendingUp className="h-4 w-4 text-emerald-400" />
               </Button>
            </CardContent>
         </Card>
         
         <Card className="lg:col-span-2 border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl">
            <CardHeader>
               <CardTitle className="text-lg font-bold">Organizational Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex flex-wrap gap-4">
                  {["Strategic Hiring", "Skills Audit", "Leadership Training", "Efficiency Optimization"].map(dept => (
                    <div key={dept} className="px-6 py-3 bg-indigo-500/5 rounded-2xl flex items-center gap-3 border border-indigo-500/10 hover:bg-indigo-500/10 transition-colors">
                       <Target className="h-4 w-4 text-indigo-600" />
                       <span className="text-sm font-bold text-indigo-700">{dept}</span>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
