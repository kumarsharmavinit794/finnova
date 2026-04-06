import { useState, useRef, useCallback } from "react";
import {
  Upload, FileText, Check, Clock, Loader2,
  X, Trash2, Eye, Download, ImageIcon, Table2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "uploading" | "processing" | "completed" | "uploaded" | "error";

interface Doc {
  id: string;
  name: string;
  size: string;
  category: string;
  status: Status;
  date: string;
  progress: number;
  fileType: string;
  rawFile?: File;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

function fmtSize(bytes: number) {
  if (bytes < 1024)       return bytes + " B";
  if (bytes < 1048576)    return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function guessCategory(name: string): string {
  const n = name.toLowerCase();
  if (/invoice|bill|receipt/.test(n))       return "Invoice";
  if (/salary|payroll|payslip/.test(n))     return "Payroll";
  if (/tds|itr|gst|tax/.test(n))            return "Tax";
  if (/contract|agreement|legal/.test(n))   return "Legal";
  if (/expense|aws|azure|cloud/.test(n))    return "Expense";
  return "Other";
}

function fileIcon(type: string) {
  if (type.includes("image"))  return ImageIcon;
  if (type.includes("sheet") || type.includes("excel") || type.includes("xlsx")) return Table2;
  return FileText;
}

const statusConfig: Record<Status, { label: string; icon: React.ElementType; color: string }> = {
  uploading:  { label: "Uploading",  icon: Loader2, color: "text-blue-600 bg-blue-50"          },
  processing: { label: "Processing", icon: Loader2, color: "text-amber-600 bg-amber-50"        },
  completed:  { label: "Completed",  icon: Check,   color: "text-primary bg-primary/10"        },
  uploaded:   { label: "Uploaded",   icon: Clock,   color: "text-muted-foreground bg-muted"    },
  error:      { label: "Error",      icon: X,       color: "text-destructive bg-destructive/10" },
};

const ALLOWED = ["application/pdf", "image/png", "image/jpeg", "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
const MAX_MB = 25;

// ─── Simulate upload ──────────────────────────────────────────────────────────

function simulateUpload(
  id: string,
  setDocs: React.Dispatch<React.SetStateAction<Doc[]>>
) {
  // Uploading: 0→100 over ~1.5s
  let prog = 0;
  const tick = setInterval(() => {
    prog = Math.min(prog + Math.random() * 18 + 8, 100);
    setDocs((prev) => prev.map((d) => d.id === id ? { ...d, progress: Math.round(prog) } : d));
    if (prog >= 100) {
      clearInterval(tick);
      // Switch to processing
      setDocs((prev) => prev.map((d) => d.id === id ? { ...d, status: "processing", progress: 100 } : d));
      setTimeout(() => {
        setDocs((prev) => prev.map((d) => d.id === id ? { ...d, status: "completed" } : d));
      }, 1400);
    }
  }, 120);
}

// ─── Initial docs ─────────────────────────────────────────────────────────────

const initial: Doc[] = [
  { id: "a", name: "Invoice_March_2026.pdf", size: "214 KB", category: "Invoice",  status: "completed", date: "Mar 18, 2026", progress: 100, fileType: "application/pdf" },
  { id: "b", name: "Receipt_AWS_Feb.pdf",    size: "98 KB",  category: "Expense",  status: "processing",date: "Mar 17, 2026", progress: 100, fileType: "application/pdf" },
  { id: "c", name: "Salary_Slips_Q4.xlsx",  size: "540 KB", category: "Payroll",  status: "completed", date: "Mar 15, 2026", progress: 100, fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  { id: "d", name: "TDS_Certificate.pdf",   size: "178 KB", category: "Tax",      status: "completed", date: "Mar 12, 2026", progress: 100, fileType: "application/pdf" },
  { id: "e", name: "Vendor_Contract.pdf",   size: "320 KB", category: "Legal",    status: "uploaded",  date: "Mar 10, 2026", progress: 100, fileType: "application/pdf" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Documents() {
  const [docs, setDocs]       = useState<Doc[]>(initial);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors]   = useState<string[]>([]);
  const inputRef              = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const newErrors: string[] = [];
    const toAdd: Doc[] = [];

    arr.forEach((file) => {
      if (!ALLOWED.includes(file.type) && !file.name.endsWith(".xlsx") && !file.name.endsWith(".csv")) {
        newErrors.push(`"${file.name}" — unsupported file type.`);
        return;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        newErrors.push(`"${file.name}" — 25MB se bada hai.`);
        return;
      }
      const id = uid();
      toAdd.push({
        id,
        name: file.name,
        size: fmtSize(file.size),
        category: guessCategory(file.name),
        status: "uploading",
        date: fmtDate(new Date()),
        progress: 0,
        fileType: file.type,
        rawFile: file,
      });
    });

    setErrors(newErrors);
    if (toAdd.length) {
      setDocs((prev) => [...toAdd, ...prev]);
      toAdd.forEach((d) => simulateUpload(d.id, setDocs));
    }
  }, []);

  // Drag handlers
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  const deleteDoc = (id: string) => setDocs((prev) => prev.filter((d) => d.id !== id));

  const completed = docs.filter((d) => d.status === "completed").length;
  const processing = docs.filter((d) => d.status === "uploading" || d.status === "processing").length;

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Documents</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload and manage your financial documents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Documents", value: docs.length               },
          { label: "Completed",       value: completed                  },
          { label: "Processing",      value: processing                 },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1 tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`rounded-2xl border-2 border-dashed transition-all p-10 text-center cursor-pointer group ${
          dragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/40 bg-card hover:bg-muted/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
          className="hidden"
          onChange={onFileInput}
        />
        <Upload className={`h-9 w-9 mx-auto mb-3 transition-colors ${dragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
        <p className="text-sm font-medium text-foreground">
          {dragging ? "Chhod do! 📂" : "Files yahan drop karein ya click karein"}
        </p>
        <p className="text-xs text-muted-foreground mt-1.5">
          PDF, Excel, CSV, Images — max 25MB per file · Multiple files ek saath
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full border border-border">PDF</span>
          <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full border border-border">Excel</span>
          <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full border border-border">CSV</span>
          <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full border border-border">Images</span>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 space-y-1">
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-destructive flex items-center gap-2">
              <X className="h-3.5 w-3.5 shrink-0" /> {e}
            </p>
          ))}
          <button onClick={() => setErrors([])} className="text-xs text-destructive/70 hover:text-destructive mt-1">Dismiss</button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-12 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border px-5 py-3">
          <span className="col-span-4">Document</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-3">Status / Progress</span>
          <span className="col-span-2">Date</span>
          <span className="col-span-1 text-right">Actions</span>
        </div>

        {docs.length === 0 && (
          <div className="py-16 text-center text-muted-foreground text-sm">
            <Upload className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p>Koi document nahi — upar se upload karein</p>
          </div>
        )}

        {docs.map((doc) => {
          const cfg = statusConfig[doc.status];
          const Icon = fileIcon(doc.fileType);
          const isActive = doc.status === "uploading" || doc.status === "processing";

          return (
            <div key={doc.id} className="grid grid-cols-12 items-center px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors gap-y-1">
              {/* Name + size */}
              <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.size}</p>
                </div>
              </div>

              {/* Category */}
              <span className="col-span-2 text-sm text-muted-foreground">{doc.category}</span>

              {/* Status + progress bar */}
              <div className="col-span-3 space-y-1.5">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                  <cfg.icon className={`h-3 w-3 ${isActive ? "animate-spin" : ""}`} />
                  {cfg.label}
                  {doc.status === "uploading" && ` ${doc.progress}%`}
                </span>
                {doc.status === "uploading" && (
                  <div className="h-1 bg-border rounded-full overflow-hidden w-28">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-200"
                      style={{ width: `${doc.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Date */}
              <span className="col-span-2 text-xs text-muted-foreground tabular-nums">{doc.date}</span>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-end gap-0.5">
                {doc.status === "completed" && (
                  <button
                    title="View"
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      if (doc.rawFile) {
                        const url = URL.createObjectURL(doc.rawFile);
                        window.open(url, "_blank");
                      }
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  title="Delete"
                  className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                  onClick={() => deleteDoc(doc.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}