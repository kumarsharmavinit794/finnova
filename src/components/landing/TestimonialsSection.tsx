import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    quote: "We switched from our CA firm and saved ₹3.2L in the first year. Filing that used to take a week now happens in minutes.",
    name: "Priya Sharma",
    role: "CFO, NexGen Retail",
    initials: "PS",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    quote: "The AI advisor caught a ₹89,000 deduction we'd been missing for two years. Paid for itself on day one.",
    name: "Rahul Mehta",
    role: "Founder, CloudStack Labs",
    initials: "RM",
    color: "bg-sky-100 text-sky-700",
  },
  {
    quote: "Managing compliance across 4 entities was a nightmare. TaxMind made it genuinely effortless.",
    name: "Anita Desai",
    role: "Head of Finance, Bloom Health",
    initials: "AD",
    color: "bg-amber-100 text-amber-700",
  },
];

export function TestimonialsSection() {
  const ref = useScrollReveal();

  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-muted/50">
      <div ref={ref} className="container max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance">
            Trusted by finance leaders
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="rounded-2xl border border-border bg-card p-6 opacity-0"
              style={{
                animation: `fade-up 0.6s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.1}s forwards`,
              }}
            >
              <p className="text-sm text-foreground leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full ${t.color} flex items-center justify-center text-xs font-semibold`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
