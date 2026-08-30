"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

type Toast = {
  type: "success" | "error";
  message: string;
};

const inputClass = "mt-2 w-full rounded-md border border-border bg-surface px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/15";
const labelClass = "text-sm font-semibold text-foreground";

function SubmitSpinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary" aria-hidden="true" />;
}

function ToastMessage({ toast }: { toast: Toast | null }) {
  if (!toast) {
    return null;
  }

  const className = toast.type === "success"
    ? "border-success/25 bg-success/10 text-success"
    : "border-error/25 bg-error/10 text-error";

  return (
    <p className={`rounded-md border px-4 py-3 text-sm font-medium ${className}`} role="status" aria-live="polite">
      {toast.message}
    </p>
  );
}

function showSupabaseError(message: string) {
  if (message.includes("row-level security")) {
    return "Assessment could not be saved because Supabase insert permission is not enabled for this table.";
  }

  return message;
}

export function AssessmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      setToast({ type: "error", message: "Please fill all required assessment fields correctly." });
      return;
    }

    setToast(null);
    setPending(true);

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim() || null,
      website: String(formData.get("website") || "").trim() || null,
      industry: String(formData.get("industry") || "").trim(),
      company_size: String(formData.get("companySize") || "").trim() || null,
      existing_tools: String(formData.get("tools") || "").trim() || null,
      challenges: String(formData.get("challenges") || "").trim(),
      automation_areas: String(formData.get("automationAreas") || "").trim() || null,
      additional_info: String(formData.get("additionalInfo") || "").trim() || null,
    };

    const { error } = await supabase.from("assessment_submissions").insert(payload);

    setPending(false);

    if (error) {
      setToast({ type: "error", message: showSupabaseError(error.message) });
      return;
    }

    form.reset();
    setToast({ type: "success", message: "Assessment saved successfully." });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-success/25 bg-success/10 p-8">
        <h2 className="text-2xl font-semibold text-foreground">Assessment sent</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          Your assessment has been saved and will appear in the admin dashboard.
        </p>
        <Button className="mt-6" onClick={() => { setSubmitted(false); setToast(null); }}>Submit another assessment</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className={labelClass}>Name <span className="text-error">*</span><input required name="name" className={inputClass} placeholder="Your full name" /></label>
        <label className={labelClass}>Company <span className="text-error">*</span><input required name="company" className={inputClass} placeholder="Business or company name" /></label>
        <label className={labelClass}>Email <span className="text-error">*</span><input required type="email" name="email" className={inputClass} placeholder="you@company.com" /></label>
        <label className={labelClass}>Phone<input type="tel" name="phone" className={inputClass} placeholder="Optional phone number" /></label>
        <label className={labelClass}>Website<input type="url" name="website" className={inputClass} placeholder="https://company.com" /></label>
        <label className={labelClass}>Industry <span className="text-error">*</span><input required name="industry" className={inputClass} placeholder="Healthcare, finance, services..." /></label>
        <label className={labelClass}>Company size<select name="companySize" className={inputClass} defaultValue=""><option value="" disabled>Select size</option><option>1-10</option><option>11-50</option><option>51-200</option><option>201-1000</option><option>1000+</option></select></label>
        <label className={labelClass}>Existing tools<input name="tools" className={inputClass} placeholder="CRM, spreadsheets, helpdesk, ERP..." /></label>
      </div>
      <label className={labelClass}>Current business challenges <span className="text-error">*</span><textarea required name="challenges" className={`${inputClass} min-h-32`} placeholder="Where is work slow, repetitive, manual, or difficult to track?" /></label>
      <label className={labelClass}>Processes to automate<textarea name="automationAreas" className={`${inputClass} min-h-28`} placeholder="Sales, support, reporting, operations, onboarding..." /></label>
      <label className={labelClass}>Additional information<textarea name="additionalInfo" className={`${inputClass} min-h-28`} placeholder="Anything else that would help IAMM understand the opportunity." /></label>
      <ToastMessage toast={toast} />
      <Button type="submit" disabled={pending} className="w-full gap-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit">
        {pending ? <><SubmitSpinner /> Submitting...</> : "Start Free Assessment"}
      </Button>
    </form>
  );
}
