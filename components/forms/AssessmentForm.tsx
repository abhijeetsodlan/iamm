"use client";

import { FormEvent, useState } from "react";
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

export function AssessmentForm() {
  const [toast, setToast] = useState<Toast | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

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
      existing_tools: String(formData.get("tools") || "").trim() || null,
      challenges: String(formData.get("challenges") || "").trim(),
      automation_areas: String(formData.get("automationAreas") || "").trim() || null,
      additional_info: String(formData.get("additionalInfo") || "").trim() || null,
      security_needs: String(formData.get("securityNeeds") || "").trim() || null,
      cloud_spend: String(formData.get("cloudSpend") || "").trim() || null,
      it_support_needs: String(formData.get("itSupportNeeds") || "").trim() || null,
    };

    try {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.saved) {
        setToast({ type: "error", message: result.error || "Your assessment could not be submitted. Please try again." });
        return;
      }
      form.reset();
      setToast({ type: "success", message: "Your assessment has been saved. IAMM will review it and follow up soon." });
    } catch {
      setToast({ type: "error", message: "Unable to confirm submission. Please check your connection or contact info@iammllc.com before trying again." });
    } finally {
      setPending(false);
    }
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
        <label className={labelClass}>Existing tools<input name="tools" className={inputClass} placeholder="CRM, spreadsheets, helpdesk, ERP..." /></label>
      </div>
      <label className={labelClass}>Current IT and business challenges <span className="text-error">*</span><textarea required name="challenges" maxLength={5000} className={`${inputClass} min-h-32`} placeholder="Tell us about unreliable systems, security concerns, rising costs, or manual work." /></label>
      <fieldset className="grid gap-5 rounded-lg border border-border p-5">
        <legend className="px-2 text-base font-semibold text-foreground">Your technology priorities</legend>
        <p className="text-sm leading-6 text-muted-foreground">These questions are optional. Share what you know; an estimate is fine.</p>
        <label className={labelClass}>What security concerns or protections should we review?<textarea name="securityNeeds" maxLength={5000} className={`${inputClass} min-h-28`} placeholder="Account access, device protection, phishing, backups, compliance requirements..." /></label>
        <label className={labelClass}>Approximately how much do you spend on cloud services each month?<input name="cloudSpend" maxLength={500} className={inputClass} placeholder="e.g. Â£500/month, $2,000/month, or not sure" /><span className="mt-2 block text-xs font-normal text-muted-foreground">Include the currency and cloud providers if known.</span></label>
        <label className={labelClass}>How is your IT supported today, and what help do you need?<textarea name="itSupportNeeds" maxLength={5000} className={`${inputClass} min-h-28`} placeholder="Internal team, external provider, or no dedicated support? Tell us about device, software, onboarding, or day-to-day support needs." /></label>
      </fieldset>
      <label className={labelClass}>Processes to automate<textarea name="automationAreas" className={`${inputClass} min-h-28`} placeholder="Sales, support, reporting, operations, onboarding..." /></label>
      <label className={labelClass}>Additional information<textarea name="additionalInfo" className={`${inputClass} min-h-28`} placeholder="Anything else that would help IAMM understand the opportunity." /></label>
      <ToastMessage toast={toast} />
      <Button type="submit" disabled={pending} className="w-full gap-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit">
        {pending ? <><SubmitSpinner /> Submitting...</> : "Start Free IT Assessment"}
      </Button>
    </form>
  );
}
