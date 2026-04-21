import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRole, UserRole } from "@/contexts/RoleContext";

import logo from "@/assets/iatt-logo.png";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const navigate = useNavigate();
  const { setRole } = useRole();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const detectedRole: UserRole = selectedRole;

    setTimeout(() => {
      setRole(detectedRole);
      setLoading(false);
      toast.success("Welcome back!", {
        description: `Logged in as ${detectedRole.charAt(0).toUpperCase() + detectedRole.slice(1)}.`,
      });
      navigate("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-blue-50/50 p-4 lg:p-12 font-body">
      {/* Main Card Container */}
      <div className="max-w-2xl w-full bg-white rounded-[24px] border-[2px] border-blue-600 shadow-xl shadow-blue-500/5 flex flex-col lg:flex-row overflow-hidden min-h-[420px]">
        
        {/* Left Side: Form */}
        <div className="w-full lg:w-[48%] p-5 lg:p-7 flex flex-col">
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
                Login
              </h1>
              <p className="text-slate-400 text-[10px] leading-relaxed font-medium mt-1">
                IATS Production Tracker Access
              </p>
            </div>

            <div className="flex gap-1 mb-6 p-1 bg-slate-100/50 rounded-lg border border-slate-200">
              {(['admin', 'manager', 'employee'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider ${
                    selectedRole === r
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="1185780732@qq.com" 
                  required 
                  className="h-10 border-0 border-b border-slate-200 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 transition-all placeholder:text-slate-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  Password
                </Label>
                <div className="relative group">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Please enter your password"
                    required 
                    className="h-10 border-0 border-b border-slate-200 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 transition-all placeholder:text-slate-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all"
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "LOGIN"}
                </Button>
              </div>
            </form>

            {selectedRole === "admin" && (
              <p className="mt-8 text-center lg:text-left text-slate-400 text-xs">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 font-bold hover:underline">
                  Register now
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="hidden lg:flex flex-1 bg-white relative items-center justify-center p-8 overflow-hidden border-l border-blue-50/50">
          {/* Background Decor */}
          <div className="absolute top-[5%] right-[5%] w-[120px] h-[120px] bg-blue-100/40 rounded-full blur-3xl" />
          
          <div className="relative z-10 w-full max-w-xs">
            <img 
              src="/login_illustration.png" 
              alt="Login Illustration" 
              className="w-full h-auto"
            />
          </div>

          {/* Floating Small Circle decor from image */}
          <div className="absolute top-[20%] right-[20%] w-3 h-3 bg-blue-400/40 rounded-full shadow-lg" />
          <div className="absolute bottom-[40%] left-[10%] w-2 h-2 bg-blue-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
