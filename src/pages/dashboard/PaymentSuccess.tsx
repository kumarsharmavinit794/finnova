import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="max-w-md mx-auto text-center space-y-6 py-16">
      <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center animate-fade-up">
        <CheckCircle2 className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Payment successful!</h1>
        <p className="text-sm text-muted-foreground">Your Professional plan is now active. You have full access to all premium features.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 text-left space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="font-medium text-foreground">Professional</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Billing</span><span className="font-medium text-foreground">Yearly</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Next renewal</span><span className="font-medium text-foreground">Mar 22, 2027</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Transaction ID</span><span className="font-mono text-xs text-foreground">TXN-2026-78A4F</span></div>
      </div>
      <Link to="/dashboard">
        <Button size="lg" className="mt-2">Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" /></Button>
      </Link>
    </div>
  );
}
