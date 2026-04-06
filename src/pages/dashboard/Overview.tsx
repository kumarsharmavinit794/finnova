import { useState, useRef, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  IndianRupee,
  FileText,
  ShieldCheck,
  Bot,
  ArrowRight,
  Search,
  X,
  LayoutDashboard,
  Receipt,
  Settings,
  HelpCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";

// ─── Data ───────────────────────────────────────────────────────────────────

const kpis = [
  { label: "Total Revenue",    value: "₹18,42,390", change: "+14.2%",      up: true,  icon: IndianRupee },
  { label: "Tax Liability",    value: "₹4,23,891",  change: "-12.1%",      up: false, icon: TrendingDown },
  { label: "Pending Filings",  value: "2",          change: "Due in 8 days", up: null, icon: FileText },
  { label: "Compliance Score", value: "94%",        change: "+6 pts",      up: true,  icon: ShieldCheck },
];

const revenueData = [
  { month: "Jul", revenue: 890000,  tax: 156000 },
  { month: "Aug", revenue: 1020000, tax: 178000 },
  { month: "Sep", revenue: 940000,  tax: 164000 },
  { month: "Oct", revenue: 1180000, tax: 206000 },
  { month: "Nov", revenue: 1350000, tax: 236000 },
  { month: "Dec", revenue: 1240000, tax: 217000 },
  { month: "Jan", revenue: 1520000, tax: 266000 },
  { month: "Feb", revenue: 1680000, tax: 294000 },
  { month: "Mar", revenue: 1842390, tax: 423891 },
];

const alerts = [
  { type: "warning", message: "GSTR-3B due on March 20th",                    time: "2 days left"  },
  { type: "info",    message: "TDS return Q4 deadline approaching",            time: "18 days left" },
  { type: "success", message: "GSTR-1 filed successfully for February",        time: "3 hours ago"  },
];

const aiSuggestions = [
  "You may qualify for ₹1.2L in R&D tax credits based on Q3 expenses",
  "Consider splitting invoice #4821 for optimal input tax credit",
  "Your effective tax rate is 4.2% below industry average — review deductions",
];

// ─── Searchable index ────────────────────────────────────────────────────────

type ResultItem = {
  type: "page" | "kpi" | "alert" | "insight";
  label: string;
  sub: string;
  icon: React.ElementType;
  to?: string;
};

const allItems: ResultItem[] = [
  // Pages / nav
  { type: "page",    label: "Dashboard Overview",  sub: "Home",                icon: LayoutDashboard, to: "/dashboard"            },
  { type: "page",    label: "GST Filings",         sub: "Filing Center",       icon: FileText,        to: "/dashboard/filings"    },
  { type: "page",    label: "Tax Reports",         sub: "Reports",             icon: Receipt,         to: "/dashboard/reports"    },
  { type: "page",    label: "AI Tax Advisor",      sub: "Ask AI",              icon: Bot,             to: "/dashboard/ai"         },
  { type: "page",    label: "Settings",            sub: "Account settings",    icon: Settings,        to: "/dashboard/settings"   },
  { type: "page",    label: "Subscription Plans",  sub: "Billing",             icon: IndianRupee,     to: "/dashboard/subscription" },
  { type: "page",    label: "Help & Support",      sub: "Support",             icon: HelpCircle,      to: "/dashboard/support"    },
  // KPIs
  ...kpis.map((k) => ({
    type: "kpi" as const,
    label: k.label,
    sub: `${k.value} · ${k.change}`,
    icon: k.icon,
  })),
  // Alerts
  ...alerts.map((a) => ({
    type: "alert" as const,
    label: a.message,
    sub: a.time,
    icon: AlertTriangle,
  })),
  // AI insights
  ...aiSuggestions.map((s) => ({
    type: "insight" as const,
    label: s,
    sub: "AI Insight",
    icon: Bot,
    to: "/dashboard/ai",
  })),
];

const typeLabel: Record<ResultItem["type"], string> = {
  page:    "Page",
  kpi:     "Metric",
  alert:   "Alert",
  insight: "AI Insight",
};

// ─── Search bar component ────────────────────────────────────────────────────

function GlobalSearch() {
  const [query, setQuery]     = useState("");
  const [open, setOpen]       = useState(false);
  const [active, setActive]   = useState(0);
  const inputRef              = useRef<HTMLInputElement>(null);
  const navigate              = useNavigate();

  const results = query.trim().length > 0
    ? allItems.filter((item) =>
        `${item.label} ${item.sub} ${typeLabel[item.type]}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  // keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (!open) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter" && results[active]?.to) {
        navigate(results[active].to!);
        setQuery(""); setOpen(false);
      }
      if (e.key === "Escape") { setQuery(""); setOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, active, navigate]);

  useEffect(() => { setActive(0); }, [query]);

  const handleSelect = (item: ResultItem) => {
    if (item.to) navigate(item.to);
    setQuery(""); setOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search filings, reports, insights…"
          className="w-full h-10 pl-9 pr-20 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {query ? (
            <button
              onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-muted-foreground border border-border rounded px-1 py-0.5 font-mono">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {open && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-border bg-card shadow-medium z-50 overflow-hidden">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results for "<span className="text-foreground">{query}</span>"
            </div>
          ) : (
            <ul>
              {results.map((item, i) => (
                <li key={i}>
                  <button
                    onMouseDown={() => handleSelect(item)}
                    onMouseEnter={() => setActive(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      active === i ? "bg-primary/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                      active === i ? "bg-primary/10" : "bg-muted"
                    }`}>
                      <item.icon className={`h-3.5 w-3.5 ${active === i ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{item.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.sub}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${
                      item.type === "page"    ? "bg-blue-100 text-blue-700"   :
                      item.type === "alert"   ? "bg-amber-100 text-amber-700" :
                      item.type === "insight" ? "bg-primary/10 text-primary"  :
                                                "bg-muted text-muted-foreground"
                    }`}>
                      {typeLabel[item.type]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function DashboardOverview() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, Rohit. Here's your financial overview.</p>
        </div>
        <GlobalSearch />
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-soft"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{kpi.label}</span>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{kpi.value}</p>
            <p className={`text-xs mt-1 ${kpi.up === true ? "text-primary" : kpi.up === false ? "text-primary" : "text-muted-foreground"}`}>
              {kpi.up === true && <TrendingUp className="h-3 w-3 inline mr-1" />}
              {kpi.change}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + Alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">Revenue & Tax Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="hsl(160, 84%, 39%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(220, 10%, 46%)"
                tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
              />
              <Tooltip
                formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, ""]}
                contentStyle={{ borderRadius: "12px", border: "1px solid hsl(220, 13%, 91%)", fontSize: "13px" }}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(160, 84%, 39%)" strokeWidth={2} fill="url(#colorRevenue)" name="Revenue" />
              <Area type="monotone" dataKey="tax" stroke="hsl(220, 10%, 70%)" strokeWidth={1.5} fill="transparent" strokeDasharray="4 4" name="Tax" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          {/* Alerts */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Alerts
            </h3>
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${
                    alert.type === "warning" ? "bg-amber-500" :
                    alert.type === "success" ? "bg-primary"   : "bg-sky-500"
                  }`} />
                  <div>
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              AI Insights
            </h3>
            <ul className="space-y-2">
              {aiSuggestions.map((s, i) => (
                <li key={i} className="text-sm text-foreground/80 leading-relaxed">• {s}</li>
              ))}
            </ul>
            <Link
              to="/dashboard/ai"
              className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-3 hover:gap-2 transition-all"
            >
              Ask AI Advisor <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}