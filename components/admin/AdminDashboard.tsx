"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

type AssessmentSubmission = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  website: string | null;
  industry: string;
  company_size: string | null;
  existing_tools: string | null;
  challenges: string;
  automation_areas: string | null;
  additional_info: string | null;
  status: string;
  created_at: string;
};

type SubmissionsResponse = {
  contacts: ContactSubmission[];
  assessments: AssessmentSubmission[];
};

type AdminView = "analytics" | "contact" | "assessment";
type AnalyticsMode = "contact" | "assessment";
type DateBuckets = { today: number; week: number; month: number };

type Filters = {
  query: string;
  status: string;
  fromDate: string;
  toDate: string;
  industry: string;
  companySize: string;
};

const defaultFilters: Filters = {
  query: "",
  status: "all",
  fromDate: "",
  toDate: "",
  industry: "all",
  companySize: "all",
};

const inputClass = "h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/15";
const labelClass = "grid gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground";
const thClass = "whitespace-nowrap border-b border-border bg-muted/70 px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground";
const tdClass = "border-b border-border px-3 py-3 align-top text-sm text-muted-foreground";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function matchesDateRange(createdAt: string, fromDate: string, toDate: string) {
  const created = new Date(createdAt).getTime();
  const from = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
  const to = toDate ? new Date(`${toDate}T23:59:59`).getTime() : null;
  if (from && created < from) return false;
  if (to && created > to) return false;
  return true;
}

function textMatches(query: string, values: Array<string | null | undefined>) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return values.some((value) => value?.toLowerCase().includes(normalizedQuery));
}

function uniqueValues(values: Array<string | null>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort((a, b) => a.localeCompare(b));
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDateBuckets(items: Array<{ created_at: string }>): DateBuckets {
  const now = new Date();
  const today = startOfDay(now).getTime();
  const weekStart = startOfDay(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const month = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  return items.reduce<DateBuckets>((counts, item) => {
    const created = new Date(item.created_at).getTime();
    if (created >= today) counts.today += 1;
    if (created >= weekStart.getTime()) counts.week += 1;
    if (created >= month) counts.month += 1;
    return counts;
  }, { today: 0, week: 0, month: 0 });
}

function sanitizeSheetValue(value: string | null | undefined) {
  return (value || "Not provided").replace(/\s+/g, " ").trim();
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function exportSpreadsheet(filename: string, sheetTitle: string, columns: Array<{ label: string; width: number }>, rows: string[][]) {
  const colgroup = columns.map((column) => `<col style="width:${column.width}px" />`).join("");
  const header = columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("");
  const body = rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8" /><style>table{border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px}th{background:#eaf3ff;color:#14213d;font-weight:700;text-align:left}th,td{border:1px solid #cbd5e1;padding:8px;vertical-align:top;mso-number-format:"\\@";}td{color:#1f2937}</style></head><body><h2>${escapeHtml(sheetTitle)}</h2><table><colgroup>${colgroup}</colgroup><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportContacts(rows: ContactSubmission[]) {
  exportSpreadsheet("iamm-contact-submissions.xls", "IAMM Contact Submissions", [
    { label: "Date", width: 180 },
    { label: "Name", width: 180 },
    { label: "Email", width: 240 },
    { label: "Company", width: 220 },
    { label: "Subject", width: 260 },
    { label: "Message", width: 520 },
    { label: "Status", width: 120 },
  ], rows.map((item) => [
    formatDate(item.created_at),
    sanitizeSheetValue(item.name),
    sanitizeSheetValue(item.email),
    sanitizeSheetValue(item.company),
    sanitizeSheetValue(item.subject),
    sanitizeSheetValue(item.message),
    sanitizeSheetValue(item.status),
  ]));
}

function exportAssessments(rows: AssessmentSubmission[]) {
  exportSpreadsheet("iamm-assessment-submissions.xls", "IAMM Assessment Submissions", [
    { label: "Date", width: 180 },
    { label: "Name", width: 180 },
    { label: "Email", width: 240 },
    { label: "Phone", width: 160 },
    { label: "Company", width: 220 },
    { label: "Website", width: 260 },
    { label: "Industry", width: 180 },
    { label: "Company Size", width: 140 },
    { label: "Existing Tools", width: 320 },
    { label: "Challenges", width: 520 },
    { label: "Automation Areas", width: 440 },
    { label: "Additional Info", width: 380 },
    { label: "Status", width: 120 },
  ], rows.map((item) => [
    formatDate(item.created_at),
    sanitizeSheetValue(item.name),
    sanitizeSheetValue(item.email),
    sanitizeSheetValue(item.phone),
    sanitizeSheetValue(item.company),
    sanitizeSheetValue(item.website),
    sanitizeSheetValue(item.industry),
    sanitizeSheetValue(item.company_size),
    sanitizeSheetValue(item.existing_tools),
    sanitizeSheetValue(item.challenges),
    sanitizeSheetValue(item.automation_areas),
    sanitizeSheetValue(item.additional_info),
    sanitizeSheetValue(item.status),
  ]));
}

function Icon({ name }: { name: "menu" | "refresh" | "logout" | "analytics" | "contact" | "assessment" | "download" }) {
  const paths = {
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    refresh: <><path d="M20 12a8 8 0 1 1-2.34-5.66" /><path d="M20 4v6h-6" /></>,
    logout: <><path d="M10 17 15 12l-5-5" /><path d="M15 12H3" /><path d="M21 4v16" /></>,
    analytics: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16v-5" /><path d="M12 16V8" /><path d="M16 16v-7" /></>,
    contact: <><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></>,
    assessment: <><path d="M8 4h8" /><path d="M9 4v3h6V4" /><path d="M6 7h12v13H6z" /><path d="M9 12h6" /><path d="M9 16h4" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function StatusBadge({ status }: { status: string }) {
  return <span className="inline-flex rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold capitalize text-muted-foreground">{status}</span>;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return <div className="rounded-lg border border-border bg-surface p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold text-foreground">{value}</p></div>;
}

function CompactFilters({ filters, statusOptions, industryOptions, companySizeOptions, view, onChange, onReset }: {
  filters: Filters;
  statusOptions: string[];
  industryOptions: string[];
  companySizeOptions: string[];
  view: "contact" | "assessment";
  onChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-lg border border-border bg-surface p-3 shadow-sm">
      <div className={`grid gap-2 md:grid-cols-2 ${view === "assessment" ? "xl:grid-cols-7" : "xl:grid-cols-5"}`}>
        <label className={`${labelClass} ${view === "assessment" ? "xl:col-span-2" : "xl:col-span-1"}`}>Search<input value={filters.query} onChange={(event) => onChange("query", event.target.value)} className={inputClass} placeholder="Search..." /></label>
        <label className={labelClass}>Status<select value={filters.status} onChange={(event) => onChange("status", event.target.value)} className={inputClass}><option value="all">All</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label className={labelClass}>From<input type="date" value={filters.fromDate} onChange={(event) => onChange("fromDate", event.target.value)} className={inputClass} /></label>
        <label className={labelClass}>To<input type="date" value={filters.toDate} onChange={(event) => onChange("toDate", event.target.value)} className={inputClass} /></label>
        {view === "assessment" ? <label className={labelClass}>Industry<select value={filters.industry} onChange={(event) => onChange("industry", event.target.value)} className={inputClass}><option value="all">All</option>{industryOptions.map((industry) => <option key={industry}>{industry}</option>)}</select></label> : null}
        {view === "assessment" ? <label className={labelClass}>Size<select value={filters.companySize} onChange={(event) => onChange("companySize", event.target.value)} className={inputClass}><option value="all">All</option>{companySizeOptions.map((size) => <option key={size}>{size}</option>)}</select></label> : null}
        <div className="flex items-end"><Button type="button" variant="secondary" className="h-9 min-h-9 w-full px-3 py-1.5 text-xs" onClick={onReset}>Reset</Button></div>
      </div>
    </section>
  );
}

function AnalyticsPanel({ data }: { data: SubmissionsResponse }) {
  const [mode, setMode] = useState<AnalyticsMode>("contact");
  const selectedItems = mode === "contact" ? data.contacts : data.assessments;
  const selectedCount = selectedItems.length;
  const selectedBuckets = getDateBuckets(selectedItems);
  const latest = selectedItems[0]?.created_at;

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        {(["contact", "assessment"] as const).map((value) => (
          <button key={value} type="button" onClick={() => setMode(value)} className={`h-10 rounded-md border px-4 text-sm font-semibold capitalize transition ${mode === value ? "border-primary bg-primary text-secondary" : "border-border bg-surface text-muted-foreground hover:border-primary/35 hover:text-foreground"}`}>{value}</button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Contact Submissions" value={data.contacts.length} />
        <StatCard label="Assessment Submissions" value={data.assessments.length} />
        <StatCard label="Selected View" value={selectedCount} />
      </div>
      <section className="rounded-lg border border-border bg-surface p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">{mode === "contact" ? "Contact" : "Assessment"} Numbers</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">Total submissions</p><p className="mt-2 text-4xl font-semibold text-foreground">{selectedCount}</p></div>
          <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">Today</p><p className="mt-2 text-4xl font-semibold text-foreground">{selectedBuckets.today}</p></div>
          <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">This week</p><p className="mt-2 text-4xl font-semibold text-foreground">{selectedBuckets.week}</p></div>
          <div className="rounded-lg bg-muted p-4"><p className="text-sm text-muted-foreground">This month</p><p className="mt-2 text-4xl font-semibold text-foreground">{selectedBuckets.month}</p></div>
          <div className="rounded-lg bg-muted p-4 md:col-span-2 xl:col-span-4"><p className="text-sm text-muted-foreground">Latest submission</p><p className="mt-2 text-lg font-semibold text-foreground">{latest ? formatDate(latest) : "No data yet"}</p></div>
        </div>
      </section>
    </div>
  );
}

export function AdminDashboard({ view }: { view: AdminView }) {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<SubmissionsResponse>({ contacts: [], assessments: [] });
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSubmissions = useCallback(async () => {
    setError("");
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setAuthChecked(true);

    const response = await fetch("/api/admin/submissions", { headers: { Authorization: `Bearer ${token}` } });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || "Failed to load submissions.");
      return;
    }

    setData(result);
  }, [router]);

  useEffect(() => { queueMicrotask(() => void loadSubmissions()); }, [loadSubmissions]);

  const statusOptions = useMemo(() => uniqueValues(view === "contact" ? data.contacts.map((item) => item.status) : data.assessments.map((item) => item.status)), [data.assessments, data.contacts, view]);
  const industryOptions = useMemo(() => uniqueValues(data.assessments.map((item) => item.industry)), [data.assessments]);
  const companySizeOptions = useMemo(() => uniqueValues(data.assessments.map((item) => item.company_size)), [data.assessments]);
  const filteredContacts = useMemo(() => data.contacts.filter((item) => (filters.status === "all" || item.status === filters.status) && matchesDateRange(item.created_at, filters.fromDate, filters.toDate) && textMatches(filters.query, [item.name, item.email, item.company, item.subject, item.message])), [data.contacts, filters]);
  const filteredAssessments = useMemo(() => data.assessments.filter((item) => (filters.status === "all" || item.status === filters.status) && (filters.industry === "all" || item.industry === filters.industry) && (filters.companySize === "all" || item.company_size === filters.companySize) && matchesDateRange(item.created_at, filters.fromDate, filters.toDate) && textMatches(filters.query, [item.name, item.company, item.email, item.phone, item.website, item.industry, item.company_size, item.existing_tools, item.challenges, item.automation_areas, item.additional_info])), [data.assessments, filters]);

  function updateFilter(key: keyof Filters, value: string) { setFilters((current) => ({ ...current, [key]: value })); }
  async function signOut() { await supabase.auth.signOut(); router.replace("/admin/login"); }

  if (!authChecked) {
    return <main className="min-h-screen bg-background" />;
  }

  const title = view === "analytics" ? "Analytics" : view === "contact" ? "Contact Submissions" : "Assessment Submissions";
  const navItems = [
    { href: "/admin/analytics", label: "Analytics", count: data.contacts.length + data.assessments.length, icon: "analytics" as const },
    { href: "/admin/contact", label: "Contacts", count: data.contacts.length, icon: "contact" as const },
    { href: "/admin/assessment", label: "Assessments", count: data.assessments.length, icon: "assessment" as const },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className={`grid min-h-screen transition-[grid-template-columns] duration-200 ${sidebarOpen ? "grid-cols-[220px_1fr] sm:grid-cols-[240px_1fr]" : "grid-cols-1"}`}>
        {sidebarOpen ? <aside className="flex min-w-0 flex-col border-r border-border bg-surface shadow-sm">
          <div className="flex h-16 items-center justify-center border-b border-border px-3">
            <button type="button" title="Close sidebar" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} className="flex h-11 w-full items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"><Icon name="menu" /></button>
          </div>
          <nav className="grid gap-1 p-3" aria-label="Admin navigation">
            {navItems.map((item) => {
              const active = pathname === item.href || (pathname === "/admin" && item.href === "/admin/analytics");
              return <Link key={item.href} href={item.href} title={item.label} onClick={() => setSidebarOpen(false)} className={`flex h-11 items-center rounded-md text-sm font-semibold transition ${sidebarOpen ? "justify-between px-3" : "justify-center px-0"} ${active ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><span className="flex items-center gap-3"><Icon name={item.icon} />{sidebarOpen ? <span>{item.label}</span> : null}</span>{sidebarOpen ? <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{item.count}</span> : null}</Link>;
            })}
            <button type="button" onClick={signOut} className="mt-1 flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-semibold text-error transition hover:bg-error/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-error/20"><Icon name="logout" />Sign Out</button>
          </nav>
        </aside> : null}

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
            <div className="flex min-h-16 flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
              <div className="flex min-w-0 items-center gap-3">{!sidebarOpen ? <button type="button" title="Open sidebar" aria-label="Open sidebar" onClick={() => setSidebarOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground transition hover:border-primary/35 hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"><Icon name="menu" /></button> : null}<div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Admin Dashboard</p><h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">{title}</h1></div></div>
              <div className="flex flex-wrap gap-2"><Button type="button" variant="secondary" className="h-10 min-h-10 gap-2 px-4 py-2" onClick={loadSubmissions}><Icon name="refresh" />Refresh</Button></div>
            </div>
          </header>

          <div className="grid gap-4 p-4 lg:p-6">
            {loading ? <div className="rounded-lg border border-border bg-surface p-6 text-sm text-muted-foreground shadow-sm">Loading submissions...</div> : null}
            {error ? <div className="rounded-lg border border-error/25 bg-error/10 p-4 text-sm text-error">{error}</div> : null}
            {!loading && !error && view === "analytics" ? <AnalyticsPanel data={data} /> : null}
            {!loading && !error && view === "contact" ? <><CompactFilters filters={filters} statusOptions={statusOptions} industryOptions={industryOptions} companySizeOptions={companySizeOptions} view="contact" onChange={updateFilter} onReset={() => setFilters(defaultFilters)} /><ContactTable rows={filteredContacts} total={data.contacts.length} /></> : null}
            {!loading && !error && view === "assessment" ? <><CompactFilters filters={filters} statusOptions={statusOptions} industryOptions={industryOptions} companySizeOptions={companySizeOptions} view="assessment" onChange={updateFilter} onReset={() => setFilters(defaultFilters)} /><AssessmentTable rows={filteredAssessments} total={data.assessments.length} /></> : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function ContactTable({ rows, total }: { rows: ContactSubmission[]; total: number }) {
  return <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm"><div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3"><div><h2 className="font-semibold text-foreground">Contact Submissions</h2><p className="text-sm text-muted-foreground">Showing {rows.length} of {total}</p></div><Button type="button" variant="secondary" className="h-9 min-h-9 gap-2 px-3 py-1.5 text-xs" onClick={() => exportContacts(rows)} disabled={!rows.length}><Icon name="download" />Export XLS</Button></div>{rows.length ? <div className="max-h-[68vh] overflow-auto"><table className="w-full min-w-[1150px] border-collapse"><thead className="sticky top-0 z-10"><tr><th className={thClass}>Date</th><th className={thClass}>Name</th><th className={thClass}>Email</th><th className={thClass}>Company</th><th className={thClass}>Subject</th><th className={thClass}>Message</th><th className={thClass}>Status</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="transition hover:bg-muted/60"><td className={`${tdClass} whitespace-nowrap`}>{formatDate(item.created_at)}</td><td className={`${tdClass} font-semibold text-foreground`}>{item.name}</td><td className={tdClass}>{item.email}</td><td className={tdClass}>{item.company || "Not provided"}</td><td className={`${tdClass} min-w-56 text-foreground`}>{item.subject}</td><td className={`${tdClass} min-w-96`}><p className="line-clamp-4 leading-6">{item.message}</p></td><td className={tdClass}><StatusBadge status={item.status} /></td></tr>)}</tbody></table></div> : <div className="border-t border-border px-4 py-10 text-center text-sm text-muted-foreground">No contact submissions match the selected filters.</div>}</section>;
}

function AssessmentTable({ rows, total }: { rows: AssessmentSubmission[]; total: number }) {
  return <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm"><div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3"><div><h2 className="font-semibold text-foreground">Assessment Submissions</h2><p className="text-sm text-muted-foreground">Showing {rows.length} of {total}</p></div><Button type="button" variant="secondary" className="h-9 min-h-9 gap-2 px-3 py-1.5 text-xs" onClick={() => exportAssessments(rows)} disabled={!rows.length}><Icon name="download" />Export XLS</Button></div>{rows.length ? <div className="max-h-[68vh] overflow-auto"><table className="w-full min-w-[1650px] border-collapse"><thead className="sticky top-0 z-10"><tr><th className={thClass}>Date</th><th className={thClass}>Name</th><th className={thClass}>Email</th><th className={thClass}>Phone</th><th className={thClass}>Company</th><th className={thClass}>Website</th><th className={thClass}>Industry</th><th className={thClass}>Size</th><th className={thClass}>Tools</th><th className={thClass}>Challenges</th><th className={thClass}>Automation</th><th className={thClass}>Additional</th><th className={thClass}>Status</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="transition hover:bg-muted/60"><td className={`${tdClass} whitespace-nowrap`}>{formatDate(item.created_at)}</td><td className={`${tdClass} font-semibold text-foreground`}>{item.name}</td><td className={tdClass}>{item.email}</td><td className={tdClass}>{item.phone || "Not provided"}</td><td className={`${tdClass} font-semibold text-foreground`}>{item.company}</td><td className={tdClass}>{item.website ? <a href={item.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">{item.website}</a> : "Not provided"}</td><td className={tdClass}>{item.industry}</td><td className={tdClass}>{item.company_size || "Not provided"}</td><td className={`${tdClass} min-w-56`}>{item.existing_tools || "Not provided"}</td><td className={`${tdClass} min-w-96`}><p className="line-clamp-4 leading-6">{item.challenges}</p></td><td className={`${tdClass} min-w-80`}><p className="line-clamp-4 leading-6">{item.automation_areas || "Not provided"}</p></td><td className={`${tdClass} min-w-72`}><p className="line-clamp-3 leading-6">{item.additional_info || "Not provided"}</p></td><td className={tdClass}><StatusBadge status={item.status} /></td></tr>)}</tbody></table></div> : <div className="border-t border-border px-4 py-10 text-center text-sm text-muted-foreground">No assessment submissions match the selected filters.</div>}</section>;
}



















