import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, ArrowLeft, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Replace with Supabase auth
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast({ title: "Link za resetovanje lozinke je poslat!" });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col auth-gradient">
      <div className="flex-1 flex flex-col items-center justify-end pb-8 px-6">
        <div className="w-16 h-16 rounded-2xl bg-secondary/20 backdrop-blur-sm flex items-center justify-center mb-4">
          <Receipt className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">
          SmartRačun
        </h1>
        <p className="text-secondary/80 text-sm mt-1">
          Resetujte svoju lozinku
        </p>
      </div>

      <Card className="rounded-t-3xl rounded-b-none border-0 shadow-2xl flex-1 min-h-[55vh]">
        <CardContent className="px-6 pt-8 pb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Nazad na prijavu
          </Link>

          {sent ? (
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Proverite email
              </h2>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                Poslali smo vam link za resetovanje lozinke na{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <Button
                onClick={() => setSent(false)}
                variant="outline"
                className="mt-6 rounded-xl"
              >
                Pošalji ponovo
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Zaboravljena lozinka
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Unesite email adresu i poslaćemo vam link za resetovanje.
              </p>

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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200"
                >
                  {loading ? "Slanje..." : "Pošalji link"}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
