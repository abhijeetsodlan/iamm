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
    return "Message could not be saved because Supabase insert permission is not enabled for this table.";
  }

  return message;
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      setToast({ type: "error", message: "Please fill all required contact fields correctly." });
      return;
    }

    setToast(null);
    setPending(true);

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      company: String(formData.get("company") || "").trim() || null,
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    const { error } = await supabase.from("contact_submissions").insert(payload);

    setPending(false);

    if (error) {
      setToast({ type: "error", message: showSupabaseError(error.message) });
      return;
    }

    form.reset();
    setToast({ type: "success", message: "Message saved successfully." });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-success/25 bg-success/10 p-8">
        <h2 className="text-2xl font-semibold text-foreground">Message sent</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          Thanks for contacting IAMM. Your message has been saved and will appear in the admin dashboard.
        </p>
        <Button className="mt-6" onClick={() => { setSubmitted(false); setToast(null); }}>Send another message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
      <label className={labelClass}>Name <span className="text-error">*</span><input required name="name" className={inputClass} placeholder="Your name" /></label>
      <label className={labelClass}>Email <span className="text-error">*</span><input required type="email" name="email" className={inputClass} placeholder="you@company.com" /></label>
      <label className={labelClass}>Company<input name="company" className={inputClass} placeholder="Company name" /></label>
      <label className={labelClass}>Subject <span className="text-error">*</span><input required name="subject" className={inputClass} placeholder="How can IAMM help?" /></label>
      <label className={labelClass}>Message <span className="text-error">*</span><textarea required name="message" className={`${inputClass} min-h-36`} placeholder="Tell us what you are exploring." /></label>
      <ToastMessage toast={toast} />
      <Button type="submit" disabled={pending} className="w-full gap-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit">
        {pending ? <><SubmitSpinner /> Sending...</> : "Send Message"}
      </Button>
    </form>
  );
}
