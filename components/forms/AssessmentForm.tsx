"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

const inputClass = "mt-2 w-full rounded-md border border-border bg-surface px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/15";
const labelClass = "text-sm font-semibold text-foreground";

export function AssessmentForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-success/25 bg-success/10 p-8">
        <h2 className="text-2xl font-semibold text-foreground">Assessment draft received on this device</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          This frontend demo is not connected to a backend yet, so no data was stored or sent. The success state is ready for the future submission flow.
        </p>
        <Button className="mt-6" onClick={() => setSubmitted(false)}>Edit submission</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
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
      <Button type="submit" className="w-full sm:w-fit">Start Free Assessment</Button>
    </form>
  );
}
