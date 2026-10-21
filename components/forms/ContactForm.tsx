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

export function ContactForm({ initialSubject = "", initialMessage = "", quoteRequest = false }: { initialSubject?: string; initialMessage?: string; quoteRequest?: boolean }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

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

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.saved) {
        setToast({ type: "error", message: result.error || "Your message could not be submitted. Please try again." });
        return;
      }
      form.reset();
      setToast({ type: "success", message: "Your message has been saved. IAMM will follow up soon." });
    } catch {
      setToast({ type: "error", message: "Unable to confirm submission. Please check your connection or contact info@iammllc.com before trying again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
      <label className={labelClass}>Name <span className="text-error">*</span><input required name="name" className={inputClass} placeholder="Your name" /></label>
      <label className={labelClass}>Email <span className="text-error">*</span><input required type="email" name="email" className={inputClass} placeholder="you@company.com" /></label>
      <label className={labelClass}>Company<input name="company" className={inputClass} placeholder="Company name" /></label>
      <label className={labelClass}>Subject <span className="text-error">*</span><input required name="subject" defaultValue={initialSubject} className={inputClass} placeholder="How can IAMM help?" /></label>
      <label className={labelClass}>Message <span className="text-error">*</span><textarea required name="message" defaultValue={initialMessage} className={`${inputClass} min-h-36`} placeholder={quoteRequest ? "Tell us your team size, number of devices, location, and support needs." : "Tell us what you are exploring."} /></label>
      <ToastMessage toast={toast} />
      <Button type="submit" disabled={pending} className="w-full gap-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit">
        {pending ? <><SubmitSpinner /> Sending...</> : quoteRequest ? "Request a Quote" : "Send Message"}
      </Button>
    </form>
  );
}

