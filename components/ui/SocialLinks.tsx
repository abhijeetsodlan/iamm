type SocialLink = {
  label: string;
  href: string;
  icon: "instagram" | "x" | "linkedin" | "whatsapp" | "email";
};

type SocialLinksProps = {
  variant?: "light" | "dark";
  showLabels?: boolean;
};

const links: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com/", icon: "instagram" },
  { label: "X", href: "https://x.com/", icon: "x" },
  { label: "LinkedIn", href: "https://linkedin.com/company/", icon: "linkedin" },
  { label: "WhatsApp", href: "https://wa.me/", icon: "whatsapp" },
  { label: "Email", href: "mailto:hello@iamm.ai", icon: "email" },
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

  if (icon === "linkedin") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M6.7 20.5H3.2V9h3.5v11.5ZM5 7.4a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm15.5 13.1H17v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.6V9h3.3v1.6h.1c.5-.9 1.6-1.9 3.3-1.9 3.5 0 4.2 2.3 4.2 5.4v6.4Z" />
      </svg>
    );
  }

  if (icon === "whatsapp") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2.8a9.1 9.1 0 0 0-7.8 13.8L3 21l4.6-1.2A9.1 9.1 0 1 0 12 2.8Zm0 16.6a7.5 7.5 0 0 1-3.8-1l-.3-.2-2.7.7.7-2.6-.2-.3A7.5 7.5 0 1 1 12 19.4Zm4.2-5.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.2.2-.3.2-.6.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.2-.3-.2-.5-.3Z" />
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
