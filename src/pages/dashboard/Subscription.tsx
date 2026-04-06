import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Shield, Building2 } from "lucide-react";

const billingCycles = [
  { key: "monthly",  label: "Monthly",   months: 1,  discount: 0  },
  { key: "q3",       label: "3 Months",  months: 3,  discount: 10 },
  { key: "h6",       label: "6 Months",  months: 6,  discount: 15 },
  { key: "yearly",   label: "12 Months", months: 12, discount: 20 },
];

const plans = [
  {
    id: "basic",
    name: "Basic",
    icon: Zap,
    baseMonthly: 1000,
    popular: false,
    features: [
      "50 AI queries/month",
      "5 GST filings/month",
      "Basic reports",
      "Email support",
      "1 user",
    ],
    missing: ["Priority support", "Unlimited filings", "Advanced analytics", "API access"],
  },
  {
    id: "pro",
    name: "Professional",
    icon: Crown,
    baseMonthly: 10000,
    popular: true,
    features: [
      "Unlimited AI queries",
      "Unlimited GST filings",
      "Advanced reports & analytics",
      "Priority support",
      "5 users",
      "API access",
      "Custom branding",
    ],
    missing: [],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building2,
    baseMonthly: 25000,
    popular: false,
    features: [
      "Unlimited AI queries",
      "Unlimited GST filings",
      "Advanced reports & analytics",
      "Dedicated account manager",
      "Unlimited users",
      "Full API access",
      "Custom branding",
      "SLA guarantee",
      "On-premise deployment",
    ],
    missing: [],
  },
];

function getPerMonth(baseMonthly: number, discount: number) {
  return Math.round(baseMonthly * (1 - discount / 100));
}

function getTotal(baseMonthly: number, months: number, discount: number) {
  return Math.round(baseMonthly * (1 - discount / 100) * months);
}

export default function Subscription() {
  const [cycle, setCycle] = useState(billingCycles[3]);
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Choose your plan</h1>
        <p className="text-sm text-muted-foreground">
          Scale your tax automation with the right plan
        </p>

        {/* Billing cycle tabs */}
        <div className="inline-flex items-center gap-1 bg-muted rounded-full p-1 mt-4">
          {billingCycles.map((c) => (
            <button
              key={c.key}
              onClick={() => setCycle(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                cycle.key === c.key
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
              {c.discount > 0 && (
                <span className="ml-1 text-primary text-xs font-semibold">-{c.discount}%</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const perMonth = getPerMonth(plan.baseMonthly, cycle.discount);
          const total = getTotal(plan.baseMonthly, cycle.months, cycle.discount);

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 space-y-6 transition-all ${
                plan.popular
                  ? "border-primary shadow-medium bg-card"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              {/* Name + icon */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      plan.popular ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <plan.icon
                      className={`h-4 w-4 ${
                        plan.popular ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">{plan.name}</h3>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground tabular-nums">
                    ₹{perMonth.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>

                {/* Billing note */}
                {cycle.months > 1 ? (
                  <p className="text-xs text-muted-foreground">
                    ₹{total.toLocaleString("en-IN")} billed every {cycle.months} months
                    {cycle.discount > 0 && (
                      <span className="ml-1 text-primary font-medium">
                        · Save {cycle.discount}%
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Billed monthly · No commitment
                  </p>
                )}
              </div>

              {/* CTA */}
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() =>
                  navigate(
                    `/dashboard/checkout?plan=${plan.id}&billing=${cycle.key}&months=${cycle.months}`
                  )
                }
              >
                {plan.id === "basic"
                  ? "Get Started"
                  : plan.id === "pro"
                  ? "Upgrade to Pro"
                  : "Contact Sales"}
              </Button>

              {/* Feature list */}
              <div className="space-y-2.5">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-foreground">{f}</span>
                  </div>
                ))}
                {plan.missing.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-border shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
        <Shield className="h-3.5 w-3.5" />
        Secured with 256-bit encryption · Cancel anytime · GST invoice included
      </div>
    </div>
  );
}