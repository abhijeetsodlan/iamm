import { ServiceIcon, type ServiceIconName } from "@/components/ui/ServiceIcon";

const benefits: { icon: ServiceIconName; title: string; description: string }[] = [
  { icon: "plug", title: "Connect your tools", description: "Bring your CRM, inbox, and business systems together." },
  { icon: "workflow", title: "Reduce manual work", description: "Automate repetitive tasks and handoffs between teams." },
  { icon: "sliders", title: "Keep people in control", description: "Build in clear ownership, approvals, and next steps." },
];

export function AiVisual() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-secondary p-6 text-white shadow-2xl shadow-primary/15 sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.2),transparent_65%)]" />
      <div className="relative flex items-center gap-4 border-b border-white/10 pb-6">
        <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
          <ServiceIcon name="cpu" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Built around your business</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Make work flow.</h2>
        </div>
      </div>
      <ul className="relative my-7 grid gap-4">
        {benefits.map((benefit) => (
          <li key={benefit.title} className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <span aria-hidden="true" className="mt-0.5 shrink-0 text-accent"><ServiceIcon name={benefit.icon} /></span>
            <div>
              <h3 className="text-sm font-semibold">{benefit.title}</h3>
              <p className="mt-1 text-sm leading-6 text-white/70">{benefit.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="relative border-t border-white/10 pt-5 text-sm leading-6 text-white/75">Practical AI. Connected systems. More time for what matters.</p>
    </div>
  );
}
