type SocialLink = {
  label: string;
  href: string;
  icon: "instagram" | "x" | "email" | "phone";
};

type SocialLinksProps = {
  variant?: "light" | "dark";
  showLabels?: boolean;
};

const links: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/iamm.llc/", icon: "instagram" },
  { label: "X", href: "https://x.com/iamm_llc", icon: "x" },
  { label: "info@iammllc.com", href: "mailto:info@iammllc.com", icon: "email" },
  { label: "+1 307 317 7872", href: "tel:+13073177872", icon: "phone" },
];

function Icon({ icon }: { icon: SocialLink["icon"] }) {
  if (icon === "instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </svg>
    );
  }

  if (icon === "x") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M18.9 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.2L6.4 21H3.3l7.3-8.3L3 3h6.5l4.4 5.7L18.9 3Zm-1.1 16.2h1.7L8.6 4.7H6.8l11 14.5Z" />
      </svg>
    );
  }

  if (icon === "phone") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function SocialLinks({ variant = "light", showLabels = false }: SocialLinksProps) {
  const isDark = variant === "dark";
  const itemClass = isDark
    ? "border-white/10 bg-white/[0.04] text-white/75 hover:border-accent/50 hover:bg-white/[0.09] hover:text-white hover:shadow-accent/10"
    : "border-border bg-surface text-muted-foreground hover:border-primary/35 hover:bg-primary/5 hover:text-primary hover:shadow-primary/10";

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          aria-label={link.label}
          title={link.label}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className={`group inline-flex h-11 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 motion-reduce:transform-none ${itemClass} ${showLabels ? "min-w-32" : "w-11"}`}
        >
          <span className="transition duration-300 group-hover:scale-110">
            <Icon icon={link.icon} />
          </span>
          {showLabels ? <span>{link.label}</span> : null}
        </a>
      ))}
    </div>
  );
}
