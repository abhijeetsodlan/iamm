"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

const inputClass = "mt-2 w-full rounded-md border border-border bg-surface px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/15";
const passwordInputClass = "mt-2 w-full rounded-md border border-border bg-surface py-3 pl-4 pr-12 text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/15";
const labelClass = "text-sm font-semibold text-foreground";

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {visible ? (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="m3 3 18 18" />
          <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
          <path d="M9.88 4.24A10.3 10.3 0 0 1 12 4c6.5 0 10 8 10 8a18.4 18.4 0 0 1-2.18 3.22" />
          <path d="M6.61 6.61A17.7 17.7 0 0 0 2 12s3.5 8 10 8a9.9 9.9 0 0 0 5.39-1.61" />
        </>
      )}
    </svg>
  );
}

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/admin/analytics");
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

    router.replace("/admin/analytics");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
      <label className={labelClass}>Email <span className="text-error">*</span><input required type="email" name="email" className={inputClass} placeholder="admin@company.com" /></label>
      <label className={labelClass}>
        Password <span className="text-error">*</span>
        <span className="relative block">
          <input required type={showPassword ? "text" : "password"} name="password" className={passwordInputClass} placeholder="Password" />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-[calc(50%-4px)] items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <EyeIcon visible={showPassword} />
          </button>
        </span>
      </label>
      {error ? <p className="rounded-md border border-error/25 bg-error/10 px-4 py-3 text-sm text-error">{error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full disabled:cursor-not-allowed disabled:opacity-70">
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}

