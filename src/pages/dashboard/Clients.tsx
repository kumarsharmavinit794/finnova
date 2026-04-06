import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Plus, MoreHorizontal } from "lucide-react";

const clientsData = [
  { name: "NexGen Retail Pvt Ltd", gstin: "27AABCU9603R1ZM", type: "Private Ltd", status: "Active", revenue: "₹4.2Cr" },
  { name: "CloudStack Labs LLP", gstin: "29AADFC3540K1ZS", type: "LLP", status: "Active", revenue: "₹1.8Cr" },
  { name: "Bloom Health Solutions", gstin: "07AAHCB4297L1ZT", type: "Private Ltd", status: "Active", revenue: "₹6.7Cr" },
  { name: "Kiran Enterprises", gstin: "24AABCK5765D1ZR", type: "Proprietorship", status: "Inactive", revenue: "₹45L" },
  { name: "Metro Logistics Co", gstin: "33AADCM9876P1ZQ", type: "Partnership", status: "Active", revenue: "₹2.1Cr" },
];

export default function Clients() {
  const [search, setSearch] = useState("");
  const filtered = clientsData.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your business clients</p>
        </div>
        <Button variant="hero" size="lg">
          <Plus className="h-4 w-4" /> Add Client
        </Button>
      </div>

      <div className="flex items-center gap-2 border border-border rounded-xl bg-card px-3 py-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients…"
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border px-5 py-3">
          <span className="col-span-2">Client</span>
          <span>GSTIN</span>
          <span>Type</span>
          <span>Revenue</span>
          <span className="text-right">Status</span>
        </div>
        {filtered.map((c, i) => (
          <div key={i} className="grid grid-cols-6 items-center px-5 py-4 border-b border-border last:border-0 text-sm hover:bg-muted/30 transition-colors">
            <span className="col-span-2 font-medium text-foreground">{c.name}</span>
            <span className="text-muted-foreground font-mono text-xs">{c.gstin}</span>
            <span className="text-muted-foreground">{c.type}</span>
            <span className="text-foreground tabular-nums">{c.revenue}</span>
            <span className="text-right">
              <span
                className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${
                  c.status === "Active" ? "text-primary bg-primary/10" : "text-muted-foreground bg-muted"
                }`}
              >
                {c.status}
              </span>
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No clients found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
