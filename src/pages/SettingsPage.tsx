import { useState } from "react";
import { ShieldCheck, KeyRound, Lock, Eye, EyeOff, Save, CheckCircle2, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill out all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    
    setIsUpdating(true);
    setTimeout(() => {
      toast.success("Admin password successfully updated. System secured.");
      setIsUpdating(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10 pt-5 px-6 md:px-0">
      {/* Header section redesigned for single focus */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                 <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 bg-clip-text">
                Admin Security
              </h1>
           </div>
           <p className="text-sm font-medium text-slate-500">Manage organizational access and cryptographic credentials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         <div className="lg:col-span-7 space-y-4">
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
               <CardHeader className="bg-indigo-600 text-white p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                        <KeyRound className="h-5 w-5 text-white" />
                     </div>
                     <div>
                        <CardTitle className="text-xl font-bold tracking-tight">Access Credentials</CardTitle>
                        <CardDescription className="text-indigo-100 mt-1 font-medium text-xs">Update your master administrative password below.</CardDescription>
                     </div>
                  </div>
               </CardHeader>

               <CardContent className="p-5 sm:p-6 space-y-5">
                  <div className="space-y-3">
                     <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                           <Lock className="h-3.5 w-3.5" /> Current Password
                        </Label>
                        <div className="relative">
                           <Input 
                             type={showPassword ? "text" : "password"} 
                             placeholder="Enter current root password" 
                             className="h-10 bg-slate-50/50 border-border/60 rounded-xl px-4 text-xs font-medium focus:border-indigo-400 transition-colors"
                             value={currentPassword}
                             onChange={(e) => setCurrentPassword(e.target.value)}
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                           <Label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">New Password</Label>
                           <Input 
                             type={showPassword ? "text" : "password"} 
                             placeholder="Enter new password" 
                             className="h-10 bg-indigo-50/20 border-indigo-100 rounded-xl px-4 text-xs font-medium focus:border-indigo-400 transition-colors"
                             value={newPassword}
                             onChange={(e) => setNewPassword(e.target.value)}
                           />
                        </div>

                        <div className="space-y-1.5">
                           <Label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Confirm Password</Label>
                           <Input 
                             type={showPassword ? "text" : "password"} 
                             placeholder="Confirm new password" 
                             className="h-10 bg-indigo-50/20 border-indigo-100 rounded-xl px-4 text-xs font-medium focus:border-indigo-400 transition-colors"
                             value={confirmPassword}
                             onChange={(e) => setConfirmPassword(e.target.value)}
                           />
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 gap-3 border-t border-border/40">
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 px-0 sm:px-2 h-8"
                       onClick={() => setShowPassword(!showPassword)}
                     >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5 mr-1.5" /> : <Eye className="h-3.5 w-3.5 mr-1.5" />}
                        {showPassword ? "Hide Characters" : "Reveal Characters"}
                     </Button>

                     <Button 
                       className="h-9 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold tracking-wide shadow-lg shadow-indigo-600/20 transition-all text-[10px] uppercase w-full sm:w-auto"
                       onClick={handleUpdatePassword}
                       disabled={isUpdating}
                     >
                        {isUpdating ? "Securing..." : "Update Credentials"} <Save className="h-3 w-3 ml-2" />
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Admin Profile Update Sidebar */}
         <div className="lg:col-span-5 space-y-6">
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
               <CardHeader className="bg-slate-50 border-b border-border/40 p-5">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <User className="h-5 w-5 text-indigo-600" />
                     </div>
                     <div>
                        <CardTitle className="text-lg font-bold tracking-tight">Admin Profile</CardTitle>
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">Manage Identity Details</CardDescription>
                     </div>
                  </div>
               </CardHeader>

               <CardContent className="p-6 space-y-5">
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                        <User className="h-3 w-3" /> Full Name
                     </Label>
                     <Input 
                       defaultValue="System Administrator" 
                       placeholder="Enter your name" 
                       className="h-10 bg-slate-50/50 border-border/60 rounded-xl px-4 text-xs font-bold focus:border-indigo-400 transition-colors"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                        <Mail className="h-3 w-3" /> Email Address
                     </Label>
                     <Input 
                       defaultValue="admin@organization.com" 
                       placeholder="Enter administrator email" 
                       className="h-10 bg-slate-50/50 border-border/60 rounded-xl px-4 text-xs font-bold focus:border-indigo-400 transition-colors"
                     />
                  </div>

                  <div className="pt-2">
                     <Button 
                       className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold tracking-wide shadow-md transition-all text-[10px] uppercase gap-2"
                       onClick={() => toast.success("Profile details updated successfully.")}
                     >
                        Update Profile <Save className="h-3 w-3" />
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}

