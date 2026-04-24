import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRole } from "@/components/RoleContext";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import heroImg from "@/assets/fields-hero.jpg";

const Login = () => {
  const nav = useNavigate();
  const { login } = useRole();
  const [role, setLocalRole] = useState<"admin" | "agent">("admin");
  const [email, setEmail] = useState("coord@smartseason.io");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  // Sync default emails purely for the demo UX convenience
  const handleRoleToggle = (newRole: "admin" | "agent") => {
    setLocalRole(newRole);
    if (newRole === "admin") setEmail("coord@smartseason.io");
    if (newRole === "agent") setEmail("amina@smartseason.io");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      login(response.data.token, response.data.user);
      toast.success("Welcome to SmartSeason");
      nav("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual */}
      <div className="relative hidden lg:block bg-gradient-hero">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay" />
        <div className="relative h-full flex flex-col justify-between p-10 text-primary-foreground">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-background/15 backdrop-blur"><Leaf className="h-5 w-5" /></div>
            <div className="font-display text-lg font-semibold">SmartSeason</div>
          </div>
          <div className="space-y-3 max-w-md">
            <h2 className="font-display text-4xl font-semibold leading-tight">Grow with confidence.</h2>
            <p className="text-primary-foreground/80">Real-time field intelligence for coordinators and agents — from planting to harvest.</p>
          </div>
          <div className="text-xs text-primary-foreground/60">© SmartSeason · Field Monitoring System</div>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6 animate-fade-up">
          <div className="lg:hidden flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Leaf className="h-5 w-5" /></div>
            <div className="font-display text-lg font-semibold">SmartSeason</div>
          </div>

          <div>
            <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
            <p className="text-muted-foreground mt-1">Sign in to your dashboard.</p>
          </div>

          <div className="grid grid-cols-2 rounded-lg border border-border bg-muted/40 p-1 text-sm">
            <button type="button" onClick={() => handleRoleToggle("admin")}
              className={`py-1.5 rounded-md transition-smooth ${role === "admin" ? "bg-background shadow-soft text-foreground font-medium" : "text-muted-foreground"}`}>
              Coordinator
            </button>
            <button type="button" onClick={() => handleRoleToggle("agent")}
              className={`py-1.5 rounded-md transition-smooth ${role === "agent" ? "bg-background shadow-soft text-foreground font-medium" : "text-muted-foreground"}`}>
              Field Agent
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="mt-1.5" 
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pass">Password</Label>
              </div>
              <Input 
                id="pass" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="mt-1.5" 
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {loading ? "Signing in..." : `Sign in as ${role === "admin" ? "Coordinator" : "Field Agent"}`}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Demo credentials are pre-filled.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
