import { useState } from "react";
import { 
  Settings, Shield, Bell, Globe, Lock, 
  RefreshCw, CheckCircle2, Sliders, Palette, 
  Trash2, Plus, ArrowUpRight, Save, Database, Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("System configuration synchronized successfully.");
      setIsSaving(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
             Strategic System Setup
           </h1>
           <p className="text-muted-foreground mt-1">Configure organizational governance and operational parameters.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Restoring defaults...")}>
              <RefreshCw className="h-4 w-4" /> Reset Local State
           </Button>
           <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-bold border-none px-8" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Synchronizing..." : "Save System Config"}
           </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
         <TabsList className="bg-secondary/40 p-1 rounded-2xl border-none h-12 gap-2">
            <TabsTrigger value="general" className="rounded-xl px-6 font-bold text-xs gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
               <Globe className="h-3.5 w-3.5" /> General
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl px-6 font-bold text-xs gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
               <Shield className="h-3.5 w-3.5" /> Governance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl px-6 font-bold text-xs gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
               <Bell className="h-3.5 w-3.5" /> Alerts
            </TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-xl px-6 font-bold text-xs gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
               <Palette className="h-3.5 w-3.5" /> Appearance
            </TabsTrigger>
         </TabsList>

         <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
                  <CardHeader className="bg-secondary/20 border-b border-border/50">
                     <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-600">
                        <Building className="h-4 w-4" /> Enterprise Identity
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                     <div className="grid gap-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Corporation Name</Label>
                        <Input defaultValue="Acme Strategic Operations" className="rounded-xl border-none bg-background h-11 px-4" />
                     </div>
                     <div className="grid gap-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Admin Command Console</Label>
                        <Input defaultValue="admin-console.acme.com" className="rounded-xl border-none bg-background h-11 px-4" />
                     </div>
                  </CardContent>
               </Card>

               <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
                  <CardHeader className="bg-secondary/20 border-b border-border/50">
                     <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-600">
                        <Database className="h-4 w-4" /> Data Retention
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                     <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-dashed border-border/50">
                        <div>
                           <p className="text-sm font-bold">Auto-Purge Logs</p>
                           <p className="text-[10px] text-muted-foreground">Delete system logs after 90 days of inactivity.</p>
                        </div>
                        <Switch defaultChecked />
                     </div>
                     <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-dashed border-border/50">
                        <div>
                           <p className="text-sm font-bold">Advanced Analytics Cache</p>
                           <p className="text-[10px] text-muted-foreground">Keep high-res throughput data for performance audits.</p>
                        </div>
                        <Switch defaultChecked />
                     </div>
                  </CardContent>
               </Card>
            </div>
         </TabsContent>

         <TabsContent value="security" className="space-y-6">
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
               <CardHeader className="bg-rose-500/10 border-b border-rose-500/20">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-rose-600">
                     <Shield className="h-4 w-4" /> Role Governance & Security
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-2">
                  {[
                    { title: "Enforce Multi-Factor (MFA)", desc: "All system administrators must use 2FA for access." },
                    { title: "Manager Escalation", desc: "Allows managers to escalate high-risk projects directly to Admin." },
                    { title: "Immutable Audit Logs", desc: "Prevents any user (including Admin) from deleting activity history." },
                    { title: "API Write Access", desc: "Requires strategic token validation for all write operations." },
                  ].map((rule, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-border/20 last:border-0 hover:bg-secondary/20 transition-colors rounded-xl">
                       <div className="flex items-center gap-4">
                          <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                             <Lock className="h-4 w-4" />
                          </div>
                          <div>
                             <p className="text-sm font-bold tracking-tight">{rule.title}</p>
                             <p className="text-xs text-muted-foreground">{rule.desc}</p>
                          </div>
                       </div>
                       <Switch defaultChecked={i < 3} />
                    </div>
                  ))}
               </CardContent>
            </Card>
         </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <Card className="border-none shadow-md bg-indigo-600 text-white rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
               <Settings size={120} />
            </div>
            <p className="text-xs font-bold opacity-70 uppercase tracking-widest italic">Global Parameter</p>
            <h3 className="text-xl font-black mt-2">Operational Baseline</h3>
            <p className="text-[10px] mt-4 font-bold bg-white/10 w-fit px-2 py-1 rounded-lg">Performance Threshold: 85%</p>
            <Button variant="outline" className="w-full mt-6 h-10 border-white/20 hover:bg-white/20 text-white border-dashed text-xs rounded-xl pointer-events-none">
               System Synchronized <CheckCircle2 className="h-4 w-4 ml-1 text-emerald-400" />
            </Button>
         </Card>
         
         <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm rounded-3xl p-6 flex flex-col justify-center border-2 border-dashed">
            <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2 mb-2"><Sliders className="h-3 w-3" /> Status Branding</p>
            <div className="flex gap-2">
               <div className="h-8 w-8 rounded-full bg-emerald-500 shadow-lg group-hover:scale-110 transition-transform" />
               <div className="h-8 w-8 rounded-full bg-indigo-600 shadow-lg group-hover:scale-110 transition-transform" />
               <div className="h-8 w-8 rounded-full bg-rose-500 shadow-lg group-hover:scale-110 transition-transform" />
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Plus className="h-4 w-4" />
               </Button>
            </div>
         </Card>
      </div>
    </div>
  );
}
