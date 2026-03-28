import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Replace with Supabase auth
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Uspešno ste se prijavili!" });
      navigate("/home");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col auth-gradient">
      {/* Top decorative area */}
      <div className="flex-1 flex flex-col items-center justify-end pb-8 px-6">
        <div className="w-16 h-16 rounded-2xl bg-secondary/20 backdrop-blur-sm flex items-center justify-center mb-4">
          <Receipt className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">
          SmartRačun
        </h1>
        <p className="text-secondary/80 text-sm mt-1">
          Pametno praćenje troškova
        </p>
      </div>

      {/* Form card */}
      <Card className="rounded-t-3xl rounded-b-none border-0 shadow-2xl flex-1 min-h-[60vh]">
        <CardContent className="px-6 pt-8 pb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Prijava
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                Email adresa
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="vas@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl bg-muted/50 border-border/50 focus:border-secondary focus:ring-secondary/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                  Lozinka
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  Zaboravili lozinku?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-muted/50 border-border/50 pr-12 focus:border-secondary focus:ring-secondary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              {loading ? "Prijavljivanje..." : "Prijavite se"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Nemate nalog?{" "}
            <Link
              to="/register"
              className="font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              Registrujte se
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
