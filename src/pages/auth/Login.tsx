import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Shield, Lock } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.27.07 2.14.74 2.9.76.95-.19 1.86-.87 3.04-.93 1.42-.07 2.6.55 3.32 1.65-3.02 1.76-2.54 5.6.37 6.77-.56 1.46-1.3 2.9-1.63 4.63zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24">
    <path fill="#F25022" d="M1 1h10v10H1z"/>
    <path fill="#00A4EF" d="M13 1h10v10H13z"/>
    <path fill="#7FBA00" d="M1 13h10v10H1z"/>
    <path fill="#FFB900" d="M13 13h10v10H13z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const socialProviders = [
  { label: "Google",    Icon: GoogleIcon,    handler: "loginWithGoogle" },
  { label: "Apple",     Icon: AppleIcon,     handler: "loginWithApple" },
  { label: "Microsoft", Icon: MicrosoftIcon, handler: "loginWithMicrosoft" },
  { label: "Facebook",  Icon: FacebookIcon,  handler: "loginWithFacebook" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("CLICKED LOGIN"); // 👈 important
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
  setError("");
  setSocialLoading(provider);

  try {
    if (provider === "Google") {
      window.location.href = "http://127.0.0.1:8000/api/auth/google";
    } 
    else if (provider === "Facebook") {
      window.location.href = "http://127.0.0.1:8000/api/auth/facebook";
    } 
    else if (provider === "Microsoft") {
      window.location.href = "http://127.0.0.1:8000/api/auth/microsoft";
    } 
    else if (provider === "Apple") {
      alert("Apple login abhi setup nahi hai");
    }
  } catch (err) {
    console.log(err);
    setError(`${provider} login failed. Please try again.`);
  } finally {
    setSocialLoading(null);
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
            AI-powered tax intelligence for modern businesses
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Join thousands of businesses automating their compliance, GST filing, and financial
            reporting with TaxMind.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/50 pt-4">
            <div className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" />256-bit encryption</div>
            <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" />SOC 2 compliant</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">TaxMind</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account to continue</p>
          </div>

          {/* Social login — 2x2 grid */}
          <div className="grid grid-cols-2 gap-2">
            {socialProviders.map(({ label, Icon, handler }) => (
              <Button
                key={label}
                variant="outline"
                type="button"
                className="w-full flex items-center gap-2 text-sm"
                disabled={!!socialLoading}
                onClick={() => handleSocialLogin(label)}
              >
                {socialLoading === label ? (
                  <div className="h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Icon />
                )}
                {label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or continue with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
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
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Remember me
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}