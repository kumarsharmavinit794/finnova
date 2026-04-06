import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Check } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDone(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center"><Shield className="h-4 w-4 text-primary-foreground" /></div>
          <span className="font-bold text-foreground">TaxMind</span>
        </div>

        {done ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Password updated</h2>
            <p className="text-sm text-muted-foreground">Your password has been reset successfully.</p>
            <Link to="/login"><Button className="w-full mt-2">Sign in</Button></Link>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Set new password</h2>
              <p className="text-sm text-muted-foreground mt-1">Create a strong password for your account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</div>}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">New Password</label>
                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <Input type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : "Update password"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
