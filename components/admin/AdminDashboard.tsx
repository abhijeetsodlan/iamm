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

type AdminView = "contact" | "assessment";

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

const inputClass = "h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/15";
const labelClass = "grid gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground";
const thClass = "whitespace-nowrap border-b border-border bg-muted/70 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground";
const tdClass = "border-b border-border px-4 py-4 align-top text-sm text-muted-foreground";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
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

function Icon({ name }: { name: "menu" | "refresh" | "logout" | "contact" | "assessment" }) {
  const paths = {
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    refresh: <><path d="M20 12a8 8 0 1 1-2.34-5.66" /><path d="M20 4v6h-6" /></>,
    logout: <><path d="M10 17 15 12l-5-5" /><path d="M15 12H3" /><path d="M21 4v16" /></>,
    contact: <><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></>,
    assessment: <><path d="M8 4h8" /><path d="M9 4v3h6V4" /><path d="M6 7h12v13H6z" /><path d="M9 12h6" /><path d="M9 16h4" /></>,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function StatusBadge({ status }: { status: string }) {
  return <span className="inline-flex rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold capitalize text-muted-foreground">{status}</span>;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function FilterBar({ filters, statusOptions, industryOptions, companySizeOptions, view, onChange, onReset }: {
  filters: Filters;
  statusOptions: string[];
  industryOptions: string[];
  companySizeOptions: string[];
  view: AdminView;
  onChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className={`${labelClass} xl:col-span-2`}>Search<input value={filters.query} onChange={(event) => onChange("query", event.target.value)} className={inputClass} placeholder="Search name, email, company, message..." /></label>
        <label className={labelClass}>Status<select value={filters.status} onChange={(event) => onChange("status", event.target.value)} className={inputClass}><option value="all">All statuses</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label className={labelClass}>From<input type="date" value={filters.fromDate} onChange={(event) => onChange("fromDate", event.target.value)} className={inputClass} /></label>
        <label className={labelClass}>To<input type="date" value={filters.toDate} onChange={(event) => onChange("toDate", event.target.value)} className={inputClass} /></label>
      </div>
      {view === "assessment" ? (
        <div className="mt-4 grid gap-3 border-t border-border pt-4 md:grid-cols-3">
          <label className={labelClass}>Industry<select value={filters.industry} onChange={(event) => onChange("industry", event.target.value)} className={inputClass}><option value="all">All industries</option>{industryOptions.map((industry) => <option key={industry}>{industry}</option>)}</select></label>
          <label className={labelClass}>Company Size<select value={filters.companySize} onChange={(event) => onChange("companySize", event.target.value)} className={inputClass}><option value="all">All sizes</option>{companySizeOptions.map((size) => <option key={size}>{size}</option>)}</select></label>
          <div className="flex items-end"><Button type="button" variant="secondary" className="h-10 min-h-10 w-full px-4 py-2" onClick={onReset}>Reset Filters</Button></div>
        </div>
      ) : <div className="mt-3 flex justify-end"><Button type="button" variant="secondary" className="h-10 min-h-10 px-4 py-2" onClick={onReset}>Reset Filters</Button></div>}
    </section>
  );
}

export function AdminDashboard({ view }: { view: AdminView }) {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<SubmissionsResponse>({ contacts: [], assessments: [] });
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState("");
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

    const response = await fetch("/api/admin/submissions", { headers: { Authorization: `Bearer ${token}` } });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || "Failed to load submissions.");
      return;
    }

    setData(result);
  }, [router]);

  useEffect(() => {
    queueMicrotask(() => void loadSubmissions());
  }, [loadSubmissions]);

  const statusOptions = useMemo(() => uniqueValues(view === "contact" ? data.contacts.map((item) => item.status) : data.assessments.map((item) => item.status)), [data.assessments, data.contacts, view]);
  const industryOptions = useMemo(() => uniqueValues(data.assessments.map((item) => item.industry)), [data.assessments]);
  const companySizeOptions = useMemo(() => uniqueValues(data.assessments.map((item) => item.company_size)), [data.assessments]);
  const filteredContacts = useMemo(() => data.contacts.filter((item) => (filters.status === "all" || item.status === filters.status) && matchesDateRange(item.created_at, filters.fromDate, filters.toDate) && textMatches(filters.query, [item.name, item.email, item.company, item.subject, item.message])), [data.contacts, filters]);
  const filteredAssessments = useMemo(() => data.assessments.filter((item) => (filters.status === "all" || item.status === filters.status) && (filters.industry === "all" || item.industry === filters.industry) && (filters.companySize === "all" || item.company_size === filters.companySize) && matchesDateRange(item.created_at, filters.fromDate, filters.toDate) && textMatches(filters.query, [item.name, item.company, item.email, item.phone, item.website, item.industry, item.company_size, item.existing_tools, item.challenges, item.automation_areas, item.additional_info])), [data.assessments, filters]);

  function updateFilter(key: keyof Filters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const title = view === "contact" ? "Contact Submissions" : "Assessment Submissions";
  const showing = view === "contact" ? filteredContacts.length : filteredAssessments.length;
  const total = view === "contact" ? data.contacts.length : data.assessments.length;

  const navItems = [
    { href: "/admin/contact", label: "Contacts", count: data.contacts.length, icon: "contact" as const },
    { href: "/admin/assessment", label: "Assessments", count: data.assessments.length, icon: "assessment" as const },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className={`grid min-h-screen transition-[grid-template-columns] duration-200 ${sidebarOpen ? "lg:grid-cols-[240px_1fr]" : "lg:grid-cols-[72px_1fr]"}`}>
        <aside className={`border-b border-border bg-surface shadow-sm lg:border-b-0 lg:border-r ${sidebarOpen ? "block" : "hidden lg:block"}`}>
          <div className={`flex h-16 items-center border-b border-border px-4 ${sidebarOpen ? "justify-between" : "justify-center"}`}>
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-secondary">IA</span>
              {sidebarOpen ? <div className="min-w-0"><p className="font-semibold text-foreground">IAMM</p><p className="text-xs text-muted-foreground">Admin</p></div> : null}
            </div>
            {sidebarOpen ? <button type="button" title="Close sidebar" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} className="rounded-md border border-border p-2 text-muted-foreground transition hover:border-primary/35 hover:text-primary"><Icon name="menu" /></button> : null}
          </div>
          <nav className="grid gap-1 p-3" aria-label="Admin navigation">
            {navItems.map((item) => {
              const active = pathname === item.href || (pathname === "/admin" && item.href === "/admin/contact");
              return (
                <Link key={item.href} href={item.href} title={item.label} className={`flex h-11 items-center rounded-md text-sm font-semibold transition ${sidebarOpen ? "justify-between px-3" : "justify-center px-0"} ${active ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  <span className="flex items-center gap-3"><Icon name={item.icon} />{sidebarOpen ? <span>{item.label}</span> : null}</span>
                  {sidebarOpen ? <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{item.count}</span> : null}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
            <div className="flex min-h-16 flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button type="button" title={sidebarOpen ? "Close sidebar" : "Open sidebar"} aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"} onClick={() => setSidebarOpen((value) => !value)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground transition hover:border-primary/35 hover:bg-muted hover:text-primary"><Icon name="menu" /></button>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Admin Dashboard</p>
                  <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" className="h-10 min-h-10 gap-2 px-4 py-2" onClick={loadSubmissions}><Icon name="refresh" />Refresh</Button>
                <Button type="button" variant="ghost" className="h-10 min-h-10 gap-2 px-4 py-2" onClick={signOut}><Icon name="logout" />Sign Out</Button>
              </div>
            </div>
          </header>

          <div className="grid gap-5 p-5 lg:p-8">
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard label="Showing" value={showing} />
              <StatCard label="Total In This Page" value={total} />
              <StatCard label="All Submissions" value={data.contacts.length + data.assessments.length} />
            </div>
            <FilterBar filters={filters} statusOptions={statusOptions} industryOptions={industryOptions} companySizeOptions={companySizeOptions} view={view} onChange={updateFilter} onReset={() => setFilters(defaultFilters)} />
            {loading ? <div className="rounded-lg border border-border bg-surface p-6 text-sm text-muted-foreground shadow-sm">Loading submissions...</div> : null}
            {error ? <div className="rounded-lg border border-error/25 bg-error/10 p-4 text-sm text-error">{error}</div> : null}
            {!loading && !error && view === "contact" ? <ContactTable rows={filteredContacts} total={data.contacts.length} /> : null}
            {!loading && !error && view === "assessment" ? <AssessmentTable rows={filteredAssessments} total={data.assessments.length} /> : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function ContactTable({ rows, total }: { rows: ContactSubmission[]; total: number }) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3"><div><h2 className="font-semibold text-foreground">Contact Submissions</h2><p className="text-sm text-muted-foreground">Showing {rows.length} of {total}</p></div></div>
      {rows.length ? <div className="overflow-x-auto"><table className="w-full min-w-[980px] border-collapse"><thead><tr><th className={thClass}>Date</th><th className={thClass}>Person</th><th className={thClass}>Company</th><th className={thClass}>Subject</th><th className={thClass}>Message</th><th className={thClass}>Status</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="transition hover:bg-muted/60"><td className={`${tdClass} whitespace-nowrap`}>{formatDate(item.created_at)}</td><td className={tdClass}><p className="font-semibold text-foreground">{item.name}</p><p>{item.email}</p></td><td className={tdClass}>{item.company || "Not provided"}</td><td className={`${tdClass} max-w-56`}><span className="font-medium text-foreground">{item.subject}</span></td><td className={`${tdClass} max-w-md`}><p className="line-clamp-4 leading-6">{item.message}</p></td><td className={tdClass}><StatusBadge status={item.status} /></td></tr>)}</tbody></table></div> : <div className="border-t border-border px-4 py-10 text-center text-sm text-muted-foreground">No contact submissions match the selected filters.</div>}
    </section>
  );
}

function AssessmentTable({ rows, total }: { rows: AssessmentSubmission[]; total: number }) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3"><div><h2 className="font-semibold text-foreground">Assessment Submissions</h2><p className="text-sm text-muted-foreground">Showing {rows.length} of {total}</p></div></div>
      {rows.length ? <div className="overflow-x-auto"><table className="w-full min-w-[1180px] border-collapse"><thead><tr><th className={thClass}>Date</th><th className={thClass}>Lead</th><th className={thClass}>Business</th><th className={thClass}>Challenges</th><th className={thClass}>Automation</th><th className={thClass}>Tools</th><th className={thClass}>Status</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="transition hover:bg-muted/60"><td className={`${tdClass} whitespace-nowrap`}>{formatDate(item.created_at)}</td><td className={tdClass}><p className="font-semibold text-foreground">{item.name}</p><p>{item.email}</p>{item.phone ? <p>{item.phone}</p> : null}</td><td className={tdClass}><p className="font-semibold text-foreground">{item.company}</p><p>{item.industry}</p><p>{item.company_size || "Size not provided"}</p>{item.website ? <p>{item.website}</p> : null}</td><td className={`${tdClass} max-w-md`}><p className="line-clamp-4 leading-6">{item.challenges}</p></td><td className={`${tdClass} max-w-md`}><p className="line-clamp-4 leading-6">{item.automation_areas || "Not provided"}</p>{item.additional_info ? <p className="mt-2 line-clamp-2"><span className="font-semibold text-foreground">Additional:</span> {item.additional_info}</p> : null}</td><td className={`${tdClass} max-w-56`}>{item.existing_tools || "Not provided"}</td><td className={tdClass}><StatusBadge status={item.status} /></td></tr>)}</tbody></table></div> : <div className="border-t border-border px-4 py-10 text-center text-sm text-muted-foreground">No assessment submissions match the selected filters.</div>}
    </section>
  );
}
