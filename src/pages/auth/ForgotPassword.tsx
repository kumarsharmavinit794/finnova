import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Shield } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center"><Shield className="h-4 w-4 text-primary-foreground" /></div>
          <span className="font-bold text-foreground">TaxMind</span>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
            <p className="text-sm text-muted-foreground">We sent a password reset link to <strong className="text-foreground">{email}</strong></p>
            <Link to="/login"><Button variant="outline" className="w-full mt-2"><ArrowLeft className="h-4 w-4 mr-2" />Back to sign in</Button></Link>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Forgot password?</h2>
              <p className="text-sm text-muted-foreground mt-1">Enter your email and we'll send you a reset link</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !email}>
                {loading ? <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : "Send reset link"}
              </Button>
            </form>
            <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
