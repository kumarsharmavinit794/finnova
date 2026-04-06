import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle, RotateCcw } from "lucide-react";

export default function PaymentFailed() {
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto text-center space-y-6 py-16">
      <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center animate-fade-up">
        <XCircle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Payment failed</h1>
        <p className="text-sm text-muted-foreground">We couldn't process your payment. Please check your card details and try again.</p>
      </div>
      <div className="flex flex-col gap-3">
        <Button onClick={() => navigate(-1)} size="lg"><RotateCcw className="h-4 w-4 mr-2" />Retry Payment</Button>
        <Link to="/dashboard"><Button variant="outline" size="lg">Back to Dashboard</Button></Link>
      </div>
    </div>
  );
}
