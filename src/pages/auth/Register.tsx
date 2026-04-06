import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Shield, Lock, Check, X } from "lucide-react";

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [company, setCompany] = useState("");
  const [gst, setGst] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = passwordRules.filter((r) => r.test(password)).length;
  const strengthColor =
    strength <= 1
      ? "bg-destructive"
      : strength <= 2
      ? "bg-yellow-500"
      : strength <= 3
      ? "bg-primary/60"
      : "bg-primary";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !mobile || !company || !gst || !password || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (!MOBILE_REGEX.test(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!GST_REGEX.test(gst.toUpperCase())) {
      setError("Enter a valid GST number (e.g. 22AAAAA0000A1Z5).");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (strength < 3) {
      setError("Please choose a stronger password.");
      return;
    }
    if (!agreed) {
      setError("You must accept the terms.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch {
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient items-center justify-center p-12">
        <div className="max-w-md text-white space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">TaxMind</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight">
            Start automating your tax compliance today
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Create your account in under 60 seconds. No credit card required.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/50 pt-4">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              256-bit encryption
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              SOC 2 compliant
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-5">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">TaxMind</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Get started with TaxMind for free
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input
                placeholder="Bindu Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Mobile Number</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 rounded-md border border-input bg-muted text-sm text-muted-foreground select-none">
                  +91
                </span>
                <Input
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Company Name</label>
              <Input
                placeholder="Acme Pvt. Ltd."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            {/* GST Number */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">GST Number</label>
              <Input
                placeholder="22AAAAA0000A1Z5"
                maxLength={15}
                value={gst}
                onChange={(e) => setGst(e.target.value.toUpperCase())}
                className="font-mono tracking-wider"
              />
              <p className="text-xs text-muted-foreground">
                15-character GSTIN (auto-uppercased)
              </p>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="space-y-2 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= strength ? strengthColor : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {passwordRules.map((rule) => (
                      <div key={rule.label} className="flex items-center gap-1 text-xs">
                        {rule.test(password) ? (
                          <Check className="h-3 w-3 text-primary" />
                        ) : (
                          <X className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span
                          className={
                            rule.test(password) ? "text-foreground" : "text-muted-foreground"
                          }
                        >
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(c) => setAgreed(c === true)}
                className="mt-0.5"
              />
              <label
                htmlFor="terms"
                className="text-xs text-muted-foreground cursor-pointer leading-relaxed"
              >
                I agree to the{" "}
                <span className="text-primary hover:underline">Terms of Service</span> and{" "}
                <span className="text-primary hover:underline">Privacy Policy</span>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}