import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { services, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex items-center font-semibold">
            <BrandLogo mode="dark" imageClassName="h-12 w-40" />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
            {siteConfig.description}
          </p>
          <p className="mt-3 text-sm leading-6 text-white/65">We work with businesses in the US and UK.</p>
          <div className="mt-6">
            <SocialLinks variant="dark" showLabels />
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
            {services.map((service) => (
              <li key={service.id}>
                <Link className="transition hover:text-white" href={`/services#${service.id}`}>{service.title}</Link>
              </li>
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


