import { Bot, FileText, BarChart3, ShieldCheck, Zap, Clock } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: Bot,
    title: "AI Tax Advisor",
    description: "Get instant answers to complex tax questions. Our AI understands Indian tax law and your business context.",
  },
  {
    icon: FileText,
    title: "Automated GST Filing",
    description: "GSTR-1, GSTR-3B, and annual returns filed automatically with intelligent data extraction.",
  },
  {
    icon: BarChart3,
    title: "Financial Analytics",
    description: "Real-time dashboards showing revenue trends, tax liabilities, and expense breakdowns.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Engine",
    description: "Never miss a deadline. Automated alerts and compliance tracking across all regulations.",
  },
  {
    icon: Zap,
    title: "Document Intelligence",
    description: "Upload invoices and receipts. AI extracts, categorizes, and reconciles data automatically.",
  },
  {
    icon: Clock,
    title: "Audit-Ready Reports",
    description: "Generate comprehensive reports that meet regulatory standards in one click.",
  },
];

export function FeaturesSection() {
  const ref = useScrollReveal();

  return (
    <section id="features" className="py-24 sm:py-32 bg-background">
      <div ref={ref} className="container max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Capabilities</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance">
            Everything your finance team needs
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            From filing to forecasting, TaxMind handles the complexity so you can focus on growth.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-medium hover:border-primary/20 opacity-0"
              style={{
                animation: `fade-up 0.6s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s forwards`,
              }}
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/15">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
