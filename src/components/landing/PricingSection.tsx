import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 2499,
    yearlyPrice: 1999,
    description: "For freelancers and small businesses",
    features: ["GST filing (up to 100 invoices)", "AI tax advisor (50 queries/mo)", "Basic reports", "Email support"],
    highlighted: false,
  },
  {
    name: "Professional",
    monthlyPrice: 6999,
    yearlyPrice: 5499,
    description: "For growing businesses",
    features: [
      "Unlimited GST filing",
      "Unlimited AI queries",
      "Advanced analytics",
      "Document intelligence",
      "Priority support",
      "Multi-entity management",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description: "For large organizations",
    features: [
      "Everything in Professional",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantees",
      "On-premise deployment",
      "Audit trail & compliance",
    ],
    highlighted: false,
  },
];

export function PricingSection() {
  const [yearly, setYearly] = useState(true);
  const ref = useScrollReveal();

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-background">
      <div ref={ref} className="container max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance">
            Simple, transparent pricing
          </h2>
        </div>

        <div className="flex items-center justify-center gap-3 mb-14">
          <span className={`text-sm ${!yearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>Monthly</span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${yearly ? "bg-primary" : "bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                yearly ? "translate-x-6" : ""
              }`}
            />
          </button>
          <span className={`text-sm ${yearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            Yearly <span className="text-primary text-xs font-semibold">Save 20%</span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 flex flex-col transition-all duration-300 opacity-0 ${
                plan.highlighted
                  ? "border-primary/30 bg-card shadow-heavy relative"
                  : "border-border bg-card hover:shadow-medium"
              }`}
              style={{
                animation: `fade-up 0.6s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.1}s forwards`,
              }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <h3 className="font-semibold text-foreground text-lg">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              <div className="mt-6 mb-6">
                {plan.monthlyPrice ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground tabular-nums">
                      ₹{(yearly ? plan.yearlyPrice : plan.monthlyPrice)?.toLocaleString("en-IN")}
                    </span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-foreground">Custom</span>
                )}
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/dashboard">
                <Button
                  variant={plan.highlighted ? "hero" : "outline"}
                  size="lg"
                  className="w-full"
                >
                  {plan.monthlyPrice ? "Start free trial" : "Contact sales"}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
