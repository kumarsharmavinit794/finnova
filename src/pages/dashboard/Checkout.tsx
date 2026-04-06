import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Smartphone,
  Building,
  Shield,
  ChevronRight,
  Lock,
  Check,
  ArrowLeft,
} from "lucide-react";

// ─── Plan & cycle lookup ────────────────────────────────────────────────────

const planMeta: Record<string, { name: string; baseMonthly: number }> = {
  basic:      { name: "Basic",        baseMonthly: 1000  },
  pro:        { name: "Professional", baseMonthly: 10000 },
  enterprise: { name: "Enterprise",   baseMonthly: 25000 },
};

const cycleDiscount: Record<string, number> = {
  monthly: 0, q3: 10, h6: 15, yearly: 20,
};

const upiApps = [
  { id: "gpay",    label: "Google Pay",  color: "#4285F4", abbr: "G" },
  { id: "phonepe", label: "PhonePe",     color: "#5F259F", abbr: "P" },
  { id: "paytm",   label: "Paytm",       color: "#00BAF2", abbr: "T" },
  { id: "bhim",    label: "BHIM UPI",    color: "#138808", abbr: "B" },
];

const banks = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "IndusInd Bank",
];

type Tab = "card" | "upi" | "netbanking";

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("en-IN");
}

function fmtCard(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function fmtExpiry(val: string) {
  const d = val.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function Checkout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const planId  = params.get("plan")    ?? "pro";
  const billing = params.get("billing") ?? "yearly";
  const months  = parseInt(params.get("months") ?? "12");
  const plan    = planMeta[planId] ?? planMeta.pro;
  const discount = cycleDiscount[billing] ?? 0;
  const perMonth = Math.round(plan.baseMonthly * (1 - discount / 100));
  const total    = Math.round(perMonth * months);
  const saved    = Math.round(plan.baseMonthly * months) - total;

  // tab
  const [tab, setTab] = useState<Tab>("card");

  // card state
  const [cardNum, setCardNum]   = useState("");
  const [expiry, setExpiry]     = useState("");
  const [cvv, setCvv]           = useState("");
  const [holder, setHolder]     = useState("");
  const [saveCard, setSaveCard] = useState(false);

  // upi state
  const [upiApp, setUpiApp] = useState<string | null>(null);
  const [upiId, setUpiId]   = useState("");

  // netbanking state
  const [bank, setBank] = useState("");

  // submit
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  const handlePay = async () => {
    setError("");

    if (tab === "card") {
      if (cardNum.replace(/\s/g, "").length < 16) { setError("Enter a valid 16-digit card number."); return; }
      if (expiry.length < 5) { setError("Enter a valid expiry date."); return; }
      if (cvv.length < 3)    { setError("Enter a valid CVV."); return; }
      if (!holder.trim())    { setError("Enter the cardholder name."); return; }
    } else if (tab === "upi") {
      if (!upiId.includes("@")) { setError("Enter a valid UPI ID (e.g. name@upi)."); return; }
    } else {
      if (!bank) { setError("Please select a bank."); return; }
    }

    setLoading(true);
    // Simulate payment gateway call
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSuccess(true);
  };

  // ── Success screen ──
  if (success) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-5">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Payment Successful!</h2>
        <p className="text-sm text-muted-foreground">
          Your <span className="font-medium text-foreground">{plan.name}</span> plan is now active.
          A GST invoice has been sent to your registered email.
        </p>
        <Button className="w-full mt-4" onClick={() => navigate("/dashboard")}>
          Go to Dashboard <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    );
  }

  // ── Checkout screen ──
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Plans
      </button>

      <div className="grid md:grid-cols-5 gap-8">
        {/* ── Left: Payment form ── */}
        <div className="md:col-span-3 space-y-5">
          <h2 className="text-xl font-bold text-foreground">Payment Details</h2>

          {/* Tab switcher */}
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { key: "card",       label: "Card",        Icon: CreditCard  },
                { key: "upi",        label: "UPI",         Icon: Smartphone  },
                { key: "netbanking", label: "Net Banking",  Icon: Building    },
              ] as { key: Tab; label: string; Icon: React.ElementType }[]
            ).map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => { setTab(key); setError(""); }}
                className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all ${
                  tab === key
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* ── Card form ── */}
          {tab === "card" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Card Number</label>
                <div className="relative">
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={cardNum}
                    onChange={(e) => setCardNum(fmtCard(e.target.value))}
                    maxLength={19}
                    className="pr-10 font-mono tracking-wider"
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Cardholder Name</label>
                <Input
                  placeholder="As on card"
                  value={holder}
                  onChange={(e) => setHolder(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Expiry</label>
                  <Input
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(fmtExpiry(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">CVV</label>
                  <Input
                    placeholder="•••"
                    type="password"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveCard"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="saveCard" className="text-sm text-muted-foreground cursor-pointer">
                  Save card for future payments
                </label>
              </div>
              {/* Accepted cards */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Accepted:</span>
                {["VISA", "MC", "AMEX", "RuPay"].map((c) => (
                  <span
                    key={c}
                    className="text-[10px] font-bold border border-border rounded px-1.5 py-0.5 text-muted-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── UPI form ── */}
          {tab === "upi" && (
            <div className="space-y-4">
              {/* App shortcuts */}
              <div className="grid grid-cols-4 gap-2">
                {upiApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setUpiApp(upiApp === app.id ? null : app.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all ${
                      upiApp === app.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: app.color }}
                    >
                      {app.abbr}
                    </div>
                    <span className="text-muted-foreground leading-tight text-center">
                      {app.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or enter UPI ID</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">UPI ID</label>
                <Input
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  e.g. mobile@paytm · name@oksbi · userid@ybl
                </p>
              </div>
            </div>
          )}

          {/* ── Net Banking form ── */}
          {tab === "netbanking" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Select Your Bank</label>
                <div className="grid grid-cols-1 gap-1 max-h-72 overflow-y-auto rounded-xl border border-border divide-y divide-border">
                  {banks.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBank(b)}
                      className={`flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${
                        bank === b
                          ? "bg-primary/5 text-primary font-medium"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {b}
                      {bank === b && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
              {bank && (
                <p className="text-xs text-muted-foreground">
                  You'll be redirected to{" "}
                  <span className="text-foreground font-medium">{bank}</span>'s secure portal to
                  complete payment.
                </p>
              )}
            </div>
          )}

          {/* Pay button */}
          <Button
            className="w-full mt-2"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Pay ₹{fmt(total)} Securely
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            256-bit SSL encrypted · RBI compliant · PCI DSS certified
          </div>
        </div>

        {/* ── Right: Order summary ── */}
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 sticky top-6">
            <h3 className="font-semibold text-foreground">Order Summary</h3>

            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{plan.name} Plan</span>
                <span className="text-foreground font-medium">₹{fmt(plan.baseMonthly)}/mo</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="text-foreground">{months} month{months > 1 ? "s" : ""}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount ({discount}%)</span>
                  <span className="text-primary font-medium">-₹{fmt(saved)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-baseline">
              <span className="text-sm font-medium text-foreground">Total</span>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground tabular-nums">₹{fmt(total)}</p>
                <p className="text-xs text-muted-foreground">+ GST as applicable</p>
              </div>
            </div>

            {/* What you get */}
            <div className="bg-muted/50 rounded-xl p-3 space-y-1.5">
              <p className="text-xs font-medium text-foreground">Included in your plan:</p>
              {[
                "GST invoice on payment",
                "Instant plan activation",
                "Cancel anytime",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}