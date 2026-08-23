"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

const inputClass = "mt-2 w-full rounded-md border border-border bg-surface px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/15";
const labelClass = "text-sm font-semibold text-foreground";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-success/25 bg-success/10 p-8">
        <h2 className="text-2xl font-semibold text-foreground">Message prepared</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          This frontend phase is not connected to a backend, so the message was not sent. The UI is ready for a future API or Supabase integration.
        </p>
        <Button className="mt-6" onClick={() => setSubmitted(false)}>Send another message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
      <label className={labelClass}>Name <span className="text-error">*</span><input required name="name" className={inputClass} placeholder="Your name" /></label>
      <label className={labelClass}>Email <span className="text-error">*</span><input required type="email" name="email" className={inputClass} placeholder="you@company.com" /></label>
      <label className={labelClass}>Company<input name="company" className={inputClass} placeholder="Company name" /></label>
      <label className={labelClass}>Subject <span className="text-error">*</span><input required name="subject" className={inputClass} placeholder="How can IAMM help?" /></label>
      <label className={labelClass}>Message <span className="text-error">*</span><textarea required name="message" className={`${inputClass} min-h-36`} placeholder="Tell us what you are exploring." /></label>
      <Button type="submit" className="w-full sm:w-fit">Send Message</Button>
    </form>
  );
}
