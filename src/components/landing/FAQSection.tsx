import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const faqs = [
  {
    q: "Is TaxMind a replacement for a Chartered Accountant?",
    a: "TaxMind automates 90% of routine CA tasks like GST filing, compliance tracking, and reporting. For complex advisory needs, our AI provides guidance backed by current tax law. Many businesses use TaxMind alongside their CA for the best of both worlds.",
  },
  {
    q: "How secure is my financial data?",
    a: "We use AES-256 encryption at rest and TLS 1.3 in transit. All data is stored in SOC 2 Type II certified data centers in India. We undergo quarterly penetration testing and annual audits.",
  },
  {
    q: "Can I migrate from Tally or other accounting software?",
    a: "Yes. We support one-click imports from Tally, Zoho Books, QuickBooks, and CSV/Excel files. Our migration team assists with the transition at no extra cost.",
  },
  {
    q: "What happens if the AI makes an error in filing?",
    a: "Every filing goes through a multi-step validation engine before submission. In the rare case of an error, our compliance guarantee covers any penalties incurred due to a TaxMind mistake.",
  },
  {
    q: "Do you support multiple GST registrations?",
    a: "Absolutely. Professional and Enterprise plans support unlimited GSTIN registrations with consolidated dashboards and inter-entity reconciliation.",
  },
];

export function FAQSection() {
  const ref = useScrollReveal();

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div ref={ref} className="container max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance">
            Common questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border rounded-xl px-5 data-[state=open]:shadow-soft transition-shadow"
            >
              <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
