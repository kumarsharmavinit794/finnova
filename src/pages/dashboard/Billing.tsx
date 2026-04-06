import { Button } from "@/components/ui/button";
import { CreditCard, Download, Crown, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const invoices = [
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: "₹1,18,000", status: "Paid" },
  { id: "INV-2026-002", date: "Feb 1, 2026", amount: "₹1,18,000", status: "Paid" },
  { id: "INV-2026-001", date: "Jan 1, 2026", amount: "₹1,18,000", status: "Paid" },
  { id: "INV-2025-012", date: "Dec 1, 2025", amount: "₹11,800", status: "Paid" },
];

export default function Billing() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your subscription and invoices</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Crown className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Current Plan</h2>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div>
            <p className="font-semibold text-foreground">Professional Plan</p>
            <p className="text-sm text-muted-foreground">₹1,00,000/year · Billed annually</p>
          </div>
          <Link to="/dashboard/subscription"><Button variant="outline" size="sm">Change Plan</Button></Link>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Renews on Mar 22, 2027</div>
          <div className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" />Visa ending 4242</div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Invoices</h2>
        </div>
        <div className="divide-y divide-border">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-foreground">{inv.id}</span>
                <span className="text-sm text-muted-foreground">{inv.date}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground tabular-nums">{inv.amount}</span>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{inv.status}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
