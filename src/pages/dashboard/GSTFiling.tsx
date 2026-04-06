import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check, Clock, AlertCircle, ArrowRight,
  X, FileText, Upload, Eye, CheckCircle2,
} from "lucide-react";

// ─── Types & Data ─────────────────────────────────────────────────────────────

type Status = "pending" | "overdue" | "filed" | "filing";

interface Filing {
  id: string;
  type: string;
  period: string;
  dueDate: string;
  status: Status;
  taxPayable?: string;
  itcClaimed?: string;
  arn?: string;
}

const initialFilings: Filing[] = [
  { id: "1", type: "GSTR-1",  period: "March 2026",    dueDate: "Apr 11, 2026", status: "pending" },
  { id: "2", type: "GSTR-3B", period: "March 2026",    dueDate: "Mar 20, 2026", status: "overdue" },
  { id: "3", type: "GSTR-1",  period: "February 2026", dueDate: "Mar 11, 2026", status: "filed",  taxPayable: "₹1,24,300", itcClaimed: "₹45,200", arn: "AA010224012345" },
  { id: "4", type: "GSTR-3B", period: "February 2026", dueDate: "Feb 20, 2026", status: "filed",  taxPayable: "₹98,700",  itcClaimed: "₹32,100", arn: "AA010224098765" },
  { id: "5", type: "GSTR-9",  period: "FY 2024-25",    dueDate: "Dec 31, 2025", status: "filed",  taxPayable: "₹4,23,891", itcClaimed: "₹1,89,400", arn: "AA0102240000001" },
];

const statusConfig = {
  filed:   { label: "Filed",      icon: Check,        color: "text-primary bg-primary/10"        },
  pending: { label: "Pending",    icon: Clock,        color: "text-amber-600 bg-amber-50"         },
  overdue: { label: "Overdue",    icon: AlertCircle,  color: "text-destructive bg-destructive/10" },
  filing:  { label: "Processing", icon: Clock,        color: "text-blue-600 bg-blue-50"           },
};

const RETURN_TYPES = ["GSTR-1", "GSTR-3B", "GSTR-4", "GSTR-9", "GSTR-9C"];
const PERIODS = [
  "March 2026","February 2026","January 2026",
  "December 2025","November 2025","FY 2024-25",
];

// ─── Overlay helper ───────────────────────────────────────────────────────────

function Overlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ─── New Filing Modal ─────────────────────────────────────────────────────────

function NewFilingModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (f: Filing) => void;
}) {
  const [step, setStep]         = useState<1 | 2 | 3>(1);
  const [type, setType]         = useState("");
  const [period, setPeriod]     = useState("");
  const [taxPayable, setTax]    = useState("");
  const [itcClaimed, setItc]    = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState("");

  const handleNext = () => {
    if (step === 1) {
      if (!type || !period) { setError("Sab fields bhari zaroor honi chahiye."); return; }
      setError(""); setStep(2);
    } else if (step === 2) {
      if (!taxPayable) { setError("Tax payable amount daalein."); return; }
      setError(""); setStep(3);
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1800));
    const arn = "AA" + Date.now().toString().slice(-10);
    const dueDays: Record<string, string> = {
      "GSTR-1": "11th of next month", "GSTR-3B": "20th of next month",
      "GSTR-9": "Dec 31", "GSTR-9C": "Dec 31",
    };
    onAdd({
      id: Date.now().toString(),
      type, period,
      dueDate: dueDays[type] ?? "As applicable",
      status: "filed",
      taxPayable: `₹${taxPayable}`,
      itcClaimed: itcClaimed ? `₹${itcClaimed}` : "₹0",
      arn,
    });
    setUploading(false);
    onClose();
  };

  return (
    <Overlay onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h2 className="font-semibold text-foreground">New GST Filing</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Step {step} of 3</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress */}
      <div className="flex gap-1 px-5 pt-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>

      <div className="px-5 py-5 space-y-4">
        {error && <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</div>}

        {/* Step 1 — Return details */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Return Details</p>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Return Type</label>
              <div className="grid grid-cols-3 gap-2">
                {RETURN_TYPES.map((t) => (
                  <button key={t} onClick={() => setType(t)}
                    className={`py-2 rounded-xl border text-sm font-medium transition-all ${
                      type === t ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground hover:border-primary/30"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Filing Period</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-background text-sm text-foreground px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
                <option value="">Period select karein</option>
                {PERIODS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 2 — Tax details */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Tax Details — <span className="text-primary">{type} · {period}</span></p>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tax Payable (₹) *</label>
              <Input placeholder="e.g. 1,24,300" value={taxPayable}
                onChange={(e) => setTax(e.target.value.replace(/[^0-9,]/g, ""))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">ITC Claimed (₹)</label>
              <Input placeholder="e.g. 45,200 (optional)" value={itcClaimed}
                onChange={(e) => setItc(e.target.value.replace(/[^0-9,]/g, ""))} />
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Summary</p>
              <p>Net Tax Payable: <span className="text-foreground font-medium">
                ₹{(parseInt(taxPayable.replace(/,/g,"") || "0") - parseInt(itcClaimed.replace(/,/g,"") || "0")).toLocaleString("en-IN")}
              </span></p>
            </div>
          </div>
        )}

        {/* Step 3 — Review & Submit */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Review & Submit</p>
            <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
              {[
                ["Return Type", type],
                ["Period", period],
                ["Tax Payable", `₹${taxPayable}`],
                ["ITC Claimed", itcClaimed ? `₹${itcClaimed}` : "₹0"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-foreground font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">Submit karne ke baad return revise nahi ho sakti. Ek baar zaroor check kar lein.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-2 px-5 pb-5">
        {step > 1 && (
          <Button variant="outline" className="flex-1" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}>
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button className="flex-1" onClick={handleNext}>
            Next <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button className="flex-1" onClick={handleSubmit} disabled={uploading}>
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Filing…
              </span>
            ) : (
              <><Upload className="h-4 w-4 mr-1.5" /> Submit Return</>
            )}
          </Button>
        )}
      </div>
    </Overlay>
  );
}

// ─── File Now Modal ───────────────────────────────────────────────────────────

function FileNowModal({ filing, onClose, onFiled }: {
  filing: Filing;
  onClose: () => void;
  onFiled: (id: string, arn: string) => void;
}) {
  const [taxPayable, setTax] = useState("");
  const [itcClaimed, setItc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]    = useState("");

  const handleFile = async () => {
    if (!taxPayable) { setError("Tax payable amount daalein."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    const arn = "AA" + Date.now().toString().slice(-10);
    onFiled(filing.id, arn);
    setLoading(false);
    onClose();
  };

  return (
    <Overlay onClose={onClose}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h2 className="font-semibold text-foreground">File {filing.type}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{filing.period} · Due: {filing.dueDate}</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-5 py-5 space-y-4">
        {filing.status === "overdue" && (
          <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-xl p-3">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-destructive">Yeh return overdue hai. Late fee applicable ho sakti hai.</p>
          </div>
        )}
        {error && <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</div>}

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tax Payable (₹) *</label>
          <Input placeholder="e.g. 1,24,300" value={taxPayable}
            onChange={(e) => setTax(e.target.value.replace(/[^0-9,]/g, ""))} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">ITC Claimed (₹)</label>
          <Input placeholder="Optional" value={itcClaimed}
            onChange={(e) => setItc(e.target.value.replace(/[^0-9,]/g, ""))} />
        </div>
        {taxPayable && (
          <div className="bg-muted/50 rounded-xl p-3 text-xs space-y-1">
            <p className="font-medium text-foreground">Net Tax Payable</p>
            <p className="text-xl font-bold text-foreground">
              ₹{(parseInt(taxPayable.replace(/,/g,"") || "0") - parseInt(itcClaimed.replace(/,/g,"") || "0")).toLocaleString("en-IN")}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2 px-5 pb-5">
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button className="flex-1" onClick={handleFile} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Filing…
            </span>
          ) : (
            <><Upload className="h-4 w-4 mr-1.5" /> Submit Return</>
          )}
        </Button>
      </div>
    </Overlay>
  );
}

// ─── View Details Modal ───────────────────────────────────────────────────────

function ViewModal({ filing, onClose }: { filing: Filing; onClose: () => void }) {
  return (
    <Overlay onClose={onClose}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h2 className="font-semibold text-foreground">{filing.type} — {filing.period}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Filing Details</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-5 py-5 space-y-4">
        <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl p-3">
          <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Successfully Filed</p>
            <p className="text-xs text-muted-foreground">ARN: <span className="font-mono text-foreground">{filing.arn}</span></p>
          </div>
        </div>

        <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
          {[
            ["Return Type",  filing.type],
            ["Period",       filing.period],
            ["Due Date",     filing.dueDate],
            ["Tax Payable",  filing.taxPayable ?? "—"],
            ["ITC Claimed",  filing.itcClaimed ?? "—"],
            ["ARN",          filing.arn ?? "—"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between px-4 py-2.5 text-sm">
              <span className="text-muted-foreground">{k}</span>
              <span className={`font-medium ${k === "ARN" ? "font-mono text-xs" : ""} text-foreground`}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-5 pb-5">
        <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
        <Button variant="outline" className="flex-1"
          onClick={() => { navigator.clipboard.writeText(filing.arn ?? ""); }}>
          <FileText className="h-4 w-4 mr-1.5" /> Copy ARN
        </Button>
      </div>
    </Overlay>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function GSTFiling() {
  const [filings, setFilings]     = useState<Filing[]>(initialFilings);
  const [showNew, setShowNew]     = useState(false);
  const [fileNow, setFileNow]     = useState<Filing | null>(null);
  const [viewing, setViewing]     = useState<Filing | null>(null);

  const handleAdd = (f: Filing) => {
    setFilings((prev) => [f, ...prev]);
  };

  const handleFiled = (id: string, arn: string) => {
    setFilings((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: "filed", arn, taxPayable: "—", itcClaimed: "—" }
          : f
      )
    );
  };

  const pending = filings.filter((f) => f.status === "pending" || f.status === "overdue").length;
  const filed   = filings.filter((f) => f.status === "filed").length;

  return (
    <div className="max-w-5xl space-y-6">
      {/* Modals */}
      {showNew  && <NewFilingModal onClose={() => setShowNew(false)} onAdd={handleAdd} />}
      {fileNow  && <FileNowModal  filing={fileNow}  onClose={() => setFileNow(null)}  onFiled={handleFiled} />}
      {viewing  && <ViewModal     filing={viewing}   onClose={() => setViewing(null)}  />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">GST Filing</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and file your GST returns</p>
        </div>
        <Button size="lg" onClick={() => setShowNew(true)}>
          New Filing <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Filed This Quarter", value: String(filed),       sub: `of ${filings.length} returns`  },
          { label: "Pending / Overdue",  value: String(pending),     sub: pending > 0 ? "Action needed" : "All clear!"   },
          { label: "Input Tax Credit",   value: "₹2,34,500",         sub: "Available"                     },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1 tabular-nums">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border px-5 py-3">
          <span>Type</span>
          <span>Period</span>
          <span>Due Date</span>
          <span>Status</span>
          <span className="text-right">Action</span>
        </div>

        {filings.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Koi filing nahi hai. "New Filing" se shuru karein.
          </div>
        )}

        {filings.map((f) => {
          const cfg = statusConfig[f.status];
          return (
            <div key={f.id} className="grid grid-cols-5 items-center px-5 py-4 border-b border-border last:border-0 text-sm hover:bg-muted/20 transition-colors">
              <span className="font-medium text-foreground">{f.type}</span>
              <span className="text-muted-foreground">{f.period}</span>
              <span className="text-muted-foreground tabular-nums">{f.dueDate}</span>
              <span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                  <cfg.icon className="h-3 w-3" />
                  {cfg.label}
                </span>
              </span>
              <span className="text-right">
                {f.status === "filed" ? (
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground"
                    onClick={() => setViewing(f)}>
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setFileNow(f)}
                    className={f.status === "overdue" ? "border-destructive/40 text-destructive hover:bg-destructive/5" : ""}>
                    File Now
                  </Button>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}