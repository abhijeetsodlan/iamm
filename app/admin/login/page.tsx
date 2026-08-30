import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin Login",
  description: "Sign in to the IAMM admin dashboard.",
  path: "/admin/login",
  noIndex: true,
});

export default function AdminLoginPage() {
  return (
    <main className="py-16 sm:py-24">
      <div className="mx-auto max-w-md px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Sign in</h1>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
