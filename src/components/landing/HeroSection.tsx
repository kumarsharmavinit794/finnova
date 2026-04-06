import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const badges = [
  { icon: Shield, label: "Bank-grade encryption" },
  { icon: Clock, label: "File in 3 minutes" },
  { icon: TrendingUp, label: "₹2.4Cr+ saved for clients" },
];

export function HeroSection() {
  const ref = useScrollReveal();

  return (
    <section className="hero-gradient relative overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div ref={ref} className="container relative max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 mb-8 opacity-0"
            style={{ animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s forwards" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Trusted by 1,200+ Indian businesses
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] text-balance opacity-0"
            style={{ animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s forwards" }}
          >
            Your AI-powered
            <br />
            finance team
          </h1>

          <p
            className="mt-6 text-lg text-white/50 max-w-xl mx-auto text-pretty leading-relaxed opacity-0"
            style={{ animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s forwards" }}
          >
            Automate GST filing, tax compliance, and financial reporting. 
            Replace spreadsheets and manual CA workflows with intelligent automation.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 opacity-0"
            style={{ animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s forwards" }}
          >
            <Link to="/dashboard">
              <Button variant="hero" size="xl">
                Start free trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="hero-outline" size="xl">
                See how it works
              </Button>
            </a>
          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-6 mt-14 opacity-0"
            style={{ animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.65s forwards" }}
          >
            {badges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-sm text-white/40">
                <badge.icon className="h-4 w-4 text-primary/70" />
                {badge.label}
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-20 max-w-4xl mx-auto opacity-0"
          style={{ animation: "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.8s forwards" }}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-2 glow-emerald">
            <div className="rounded-xl bg-gradient-to-b from-white/[0.06] to-transparent p-6 sm:p-8">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Tax Liability", value: "₹4,23,891", change: "-12%" },
                  { label: "Pending Filings", value: "2", change: "Due in 8 days" },
                  { label: "Compliance Score", value: "94%", change: "+6 pts" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xs text-white/30 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1 tabular-nums">{stat.value}</p>
                    <p className="text-xs text-primary mt-1">{stat.change}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 h-32 rounded-lg bg-white/[0.03] border border-white/5 flex items-end justify-around px-4 pb-4">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className="w-full max-w-[24px] rounded-t bg-primary/40 transition-all"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
