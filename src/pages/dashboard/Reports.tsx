import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const expenseData = [
  { category: "Salaries", amount: 680000 },
  { category: "Cloud Infra", amount: 234000 },
  { category: "Marketing", amount: 156000 },
  { category: "Office", amount: 89000 },
  { category: "Legal", amount: 45000 },
];

const taxBreakdown = [
  { name: "GST", value: 234500, color: "hsl(160, 84%, 39%)" },
  { name: "TDS", value: 89200, color: "hsl(200, 70%, 50%)" },
  { name: "Income Tax", value: 100191, color: "hsl(45, 80%, 50%)" },
];

const monthlyRevenue = [
  { month: "Oct", value: 1180000 },
  { month: "Nov", value: 1350000 },
  { month: "Dec", value: 1240000 },
  { month: "Jan", value: 1520000 },
  { month: "Feb", value: 1680000 },
  { month: "Mar", value: 1842000 },
];

export default function Reports() {
  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Financial insights and trend analysis</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(220, 10%, 46%)"
                tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
              />
              <Tooltip
                formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid hsl(220, 13%, 91%)", fontSize: "13px" }}
              />
              <Bar dataKey="value" fill="hsl(160, 84%, 39%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">Tax Breakdown</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={taxBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {taxBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, ""]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid hsl(220, 13%, 91%)", fontSize: "13px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {taxBreakdown.map((t) => (
              <div key={t.name} className="flex items-center gap-2 text-sm">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-muted-foreground">{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">Expense Categories</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={expenseData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                stroke="hsl(220, 10%, 46%)"
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" width={80} />
              <Tooltip
                formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Amount"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid hsl(220, 13%, 91%)", fontSize: "13px" }}
              />
              <Bar dataKey="amount" fill="hsl(160, 84%, 39%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
