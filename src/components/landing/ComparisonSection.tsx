import { Check, X } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const rows = [
  { feature: "GST Filing", traditional: "Manual, error-prone", ai: "Automated, 99.8% accurate" },
  { feature: "Tax Advisory", traditional: "Hourly billing, delayed", ai: "Instant AI responses, 24/7" },
  { feature: "Compliance Tracking", traditional: "Spreadsheets & reminders", ai: "Real-time monitoring" },
  { feature: "Document Processing", traditional: "Manual data entry", ai: "OCR + AI extraction" },
  { feature: "Cost per month", traditional: "₹15,000 – ₹50,000", ai: "Starting at ₹2,499" },
  { feature: "Turnaround Time", traditional: "3–7 business days", ai: "Under 3 minutes" },
];

export function ComparisonSection() {
  const ref = useScrollReveal();

  return (
    <section id="comparison" className="py-24 sm:py-32 bg-muted/50">
      <div ref={ref} className="container max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Why switch</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance">
            Traditional CA vs TaxMind AI
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft">
          <div className="grid grid-cols-3 text-sm font-semibold border-b border-border">
            <div className="p-4 text-muted-foreground">Feature</div>
            <div className="p-4 text-center text-muted-foreground bg-muted/30">Traditional CA</div>
            <div className="p-4 text-center text-primary">TaxMind AI</div>
          </div>
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className="grid grid-cols-3 text-sm border-b border-border last:border-0 opacity-0"
              style={{
                animation: `fade-up 0.5s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.06}s forwards`,
              }}
            >
              <div className="p-4 font-medium text-foreground">{row.feature}</div>
              <div className="p-4 text-center text-muted-foreground bg-muted/30 flex items-center justify-center gap-2">
                <X className="h-3.5 w-3.5 text-destructive/60 shrink-0 hidden sm:block" />
                <span>{row.traditional}</span>
              </div>
              <div className="p-4 text-center text-foreground flex items-center justify-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary shrink-0 hidden sm:block" />
                <span>{row.ai}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
