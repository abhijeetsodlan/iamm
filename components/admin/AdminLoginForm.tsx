"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

const inputClass = "mt-2 w-full rounded-md border border-border bg-surface px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/15";
const labelClass = "text-sm font-semibold text-foreground";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/admin");
      }
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace("/admin");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
      <label className={labelClass}>Email <span className="text-error">*</span><input required type="email" name="email" className={inputClass} placeholder="admin@company.com" /></label>
      <label className={labelClass}>Password <span className="text-error">*</span><input required type="password" name="password" className={inputClass} placeholder="Password" /></label>
      {error ? <p className="rounded-md border border-error/25 bg-error/10 px-4 py-3 text-sm text-error">{error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full disabled:cursor-not-allowed disabled:opacity-70">
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
