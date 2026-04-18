import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Simulate token validation
    if (!token) {
      toast.error("Invalid or missing invitation token.");
      setIsValidating(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsValidating(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }

    if (!/\d/.test(password)) {
      return toast.error("Password must contain at least one number.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success("Account activated! Password set successfully.");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }, 2000);
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mx-auto" />
          <p className="text-slate-400 font-medium animate-pulse">Validating secure invitation token...</p>
        </motion.div>
      </div>
    );
  }

  if (!token) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
          <Card className="w-full max-w-[400px] bg-slate-900 border-rose-500/20 shadow-2xl rounded-3xl overflow-hidden">
             <CardHeader className="text-center p-8">
                <div className="h-16 w-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                   <ShieldCheck className="h-8 w-8 text-rose-500" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Access Denied</CardTitle>
                <CardDescription className="text-slate-400 mt-2">
                   This invitation link is invalid, expired, or has already been used. Please contact your administrator for a new invite.
                </CardDescription>
             </CardHeader>
             <CardFooter className="p-8 pt-0">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border-none rounded-xl h-12 font-bold" onClick={() => navigate("/login")}>
                   Back to Login
                </Button>
             </CardFooter>
          </Card>
       </div>
     );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-2xl rounded-3xl overflow-hidden">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <CardHeader className="text-center p-8 pb-4">
                  <div className="h-12 w-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 rotate-12">
                    <Lock className="h-6 w-6 text-indigo-500 -rotate-12" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight text-white uppercase italic">Finalize Onboarding</CardTitle>
                  <CardDescription className="text-slate-400 mt-2 text-sm leading-relaxed">
                    Welcome to the workspace. Please set a secure password to activate your account.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-4">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Secure Password</Label>
                       <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Min 8 characters..." 
                            className="bg-white/5 border-white/10 rounded-xl h-11 pl-4 pr-10 text-white focus:ring-indigo-500/30"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Confirm Identity</Label>
                       <Input 
                         type="password"
                         placeholder="Repeat password..." 
                         className="bg-white/5 border-white/10 rounded-xl h-11 pl-4 text-white focus:ring-indigo-500/30"
                         value={confirmPassword}
                         onChange={(e) => setConfirmPassword(e.target.value)}
                         required
                       />
                    </div>

                    <div className="pt-2">
                       <Button 
                         disabled={isLoading}
                         className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 rounded-xl font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 gap-2 border-none"
                       >
                         {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Activate My Account"}
                       </Button>
                    </div>
                  </form>
                </CardContent>

                <CardFooter className="bg-white/[0.02] border-t border-white/5 p-6 flex flex-col items-center gap-1">
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Enterprise Security Protocol</p>
                   <p className="text-[9px] text-slate-600 italic">256-bit AES Encryption Enabled</p>
                </CardFooter>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <div className="h-20 w-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-inner group">
                   <CheckCircle2 className="h-10 w-10 text-emerald-500 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Onboarding Complete</h3>
                <p className="text-slate-400 mt-4 text-sm leading-relaxed max-w-[280px] mx-auto">
                   Your account is now active. You are being redirected to the central terminal...
                </p>
                
                <div className="mt-8 flex justify-center gap-1">
                   {[0, 1, 2].map(i => (
                     <motion.div 
                       key={i}
                       animate={{ opacity: [0.3, 1, 0.3] }}
                       transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                       className="h-1 w-6 bg-indigo-500 rounded-full"
                     />
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}
