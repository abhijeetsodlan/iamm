import Link from "next/link";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { services, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-bold">IA</span>
            <span className="text-lg">IAMM</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
            AI, automation, and digital solutions for businesses that want practical systems, cleaner workflows, and scalable operations.
          </p>
          <div className="mt-6">
            <SocialLinks variant="dark" />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Company</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link className="transition hover:text-white" href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Services</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            {services.slice(0, 5).map((service) => (
              <li key={service.title}>{service.title}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Legal</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            <li><Link className="transition hover:text-white" href="/privacy">Privacy Policy</Link></li>
            <li><Link className="transition hover:text-white" href="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-6 text-center text-sm text-white/55">
        Copyright {new Date().getFullYear()} IAMM. All rights reserved.
      </div>
    </footer>
  );
}
