import { managedITPlans as plans, projectServices as projects } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "IT Support Plans & Custom Quotes",
  description: "Compare Essential, Business, and Premium IT support plans from IAMM Solutions. Get a custom quote for your business in the US, UK, or Canada.",
  path: "/plans",
});

const reasons = [
  { title: "Predictable costs", description: "One monthly fee for your agreed support scope, with any additional work quoted upfront." },
  { title: "Proactive support", description: "Monitoring and maintenance help catch problems before they slow your team down." },
  { title: "Fully remote", description: "Support for businesses across the US, UK, and Canada." },
  { title: "Flexible plans", description: "Your support can grow as your team, devices, and technology needs change." },
];

function Check() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>;
}

export default function PlansPage() {
  return (
    <main>
      <section className="bg-background px-6 pb-12 pt-16 sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Monthly IT support</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">The right support for your next stage.</h1>
          <p className="mt-6 text-pretty text-lg leading-8 text-muted-foreground">Every business is different, so we tailor each plan to your team size, devices, and goals. Choose the level of support you need and we&apos;ll send you a custom quote.</p>
        </div>
      </section>

      <section aria-label="Compare monthly IT support plans" className="px-6 pb-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className={`relative flex flex-col rounded-xl border bg-surface p-7 shadow-sm ${plan.popular ? "border-primary ring-2 ring-primary/15" : "border-border"}`}>
              <div className="mb-5 min-h-7">{plan.popular ? <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-bold text-secondary">Most popular</span> : null}</div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">{plan.name}</h2>
              <p className="mt-3 min-h-14 text-sm leading-7 text-muted-foreground">{plan.description}</p>
              <p className="mt-6 border-b border-border pb-6 text-lg font-semibold text-foreground">Custom monthly quote</p>
              <ul className="my-6 grid gap-4 text-sm leading-6 text-muted-foreground">
                {plan.features.map((feature) => <li key={feature} className="flex gap-3"><Check /><span>{feature}</span></li>)}
              </ul>
              <div className="mt-auto">
                <ButtonLink href={`/contact?plan=${plan.name.toLowerCase()}`} variant={plan.popular ? "primary" : "secondary"} className="w-full" aria-label={`Get a quote for the ${plan.name} plan`}>Get a Quote</ButtonLink>
              </div>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-muted-foreground">Your quote will confirm support hours, time zone, covered devices, and service scope.</p>
      </section>

      <section className="border-y border-border bg-muted px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">One-off projects</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">Need something specific?</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">We also take on focused projects, quoted individually around your requirements.</p>
            <ButtonLink href="/contact?request=project" className="mt-7">Discuss a Project</ButtonLink>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => <li key={project} className="flex items-start gap-3 rounded-lg border border-border bg-surface p-5 text-sm font-semibold leading-6 text-foreground"><Check /><span>{project}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground">Why monthly IT with IAMM?</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason) => <div key={reason.title} className="rounded-lg border border-border bg-surface p-6"><h3 className="font-semibold text-foreground">{reason.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{reason.description}</p></div>)}
          </div>
        </div>
      </section>
      <CtaBand title="Get your custom quote" description="Tell us about your business and we'll recommend the right plan within one business day." primaryHref="/contact?request=quote" primaryLabel="Request a Quote" secondaryHref="/assessment" secondaryLabel="Free IT Assessment" />
    </main>
  );
}
