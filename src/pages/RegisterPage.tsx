import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import logo from "@/assets/iatt-logo.png";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      setLoading(false);
      toast.success("Account created successfully!", {
        description: "You can now log in with your credentials.",
      });
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-blue-50/50 p-4 lg:p-12 font-body">
      {/* Main Card Container */}
      <div className="max-w-2xl w-full bg-white rounded-[24px] border-[2px] border-blue-600 shadow-xl shadow-blue-500/5 flex flex-col lg:flex-row overflow-hidden min-h-[420px]">
        
        {/* Left Side: Illustration */}
        <div className="hidden lg:flex flex-1 bg-white relative items-center justify-center p-6 overflow-hidden order-last border-l border-blue-50/50">
          <div className="relative z-10 w-full max-w-[240px]">
            <img 
              src="/login_illustration.png" 
              alt="Register Illustration" 
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-[50%] p-5 lg:p-7 flex flex-col">
          <div className="mb-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")}>
            <img src={logo} alt="IATT Logo" className="h-8 w-auto" />
            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.15em] leading-none">
              IATS Production Tracker
            </h2>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-xs w-full mx-auto lg:mx-0">
            <div className="flex flex-col items-center mb-8 text-center sm:items-start sm:text-left">
              <div className="h-[120px] w-[120px] mb-6 bg-white rounded-3xl flex items-center justify-center p-4 border border-slate-100 shadow-xl shadow-blue-500/5">
                <img src={logo} alt="IATT Logo" className="h-full w-auto object-contain" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                Register
              </h1>
              <p className="text-slate-400 text-[10px] leading-relaxed font-medium mt-1">
                IATS Production Tracker Access
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="first-name" className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">First name</Label>
                  <Input id="first-name" placeholder="John" required className="h-8 border-0 border-b border-slate-200 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 transition-all text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last-name" className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">Last name</Label>
                  <Input id="last-name" placeholder="Doe" required className="h-8 border-0 border-b border-slate-200 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 transition-all text-xs" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">Work Email</Label>
                <Input id="email" type="email" placeholder="name@company.com" required className="h-8 border-0 border-b border-slate-200 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 transition-all text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Create password"
                    required 
                    className="h-8 border-0 border-b border-slate-200 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 transition-all text-xs pr-8" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-lg shadow-blue-500/20 transition-all" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "CREATE ACCOUNT"}
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center lg:text-left text-slate-400 text-[10px]">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
