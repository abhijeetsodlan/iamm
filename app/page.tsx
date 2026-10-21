import { AiVisual } from "@/components/home/AiVisual";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/lib/site";
import { createMetadata, defaultTitle, defaultDescription } from "@/lib/seo";

export const metadata = createMetadata({
  title: defaultTitle,
  description: defaultDescription,
  path: "/",
  keywords: ["IT services US", "IT services UK", "AI automation company"],
});

const values = [
  [
    "Work Smarter",
    "Eliminate repetitive tasks so your team can spend more time on the work that actually matters.",
  ],
  [
    "Automate with Purpose",
    "Connect your tools, workflows, and processes to create automation that works reliably in the real world.",
  ],
  [
    "Reduce the Cost of Complexity",
    "Replace unnecessary manual effort with smarter systems that help your business scale efficiently.",
  ],
  [
    "Create Better Experiences",
    "Respond faster, work more consistently, and give customers a smoother experience at every touchpoint.",
  ],
];

const businessNeeds = [
  {
    title: "Invoice processing",
    description: "We believe your finance team should spend less time copying invoice details and chasing approvals, and more time making informed decisions.",
  },
  {
    title: "Lead management",
    description: "Every enquiry deserves a clear owner and a thoughtful follow-up. We help connect the steps so your team can focus on customer conversations.",
  },
  {
    title: "Team reporting",
    description: "Your team should spend meetings deciding what comes next, rather than rebuilding the same reports. We focus on making everyday information easier to use.",
  },
];

const processSteps = [
  {
    title: "Discover",
    description: "Understand your business goals, current technology, and day-to-day IT support needs.",
  },
  {
    title: "Assess",
    description: "Review security risks, system reliability, and cloud costs to agree on clear priorities.",
  },
  {
    title: "Implement",
    description: "Put the right support, security controls, and technology improvements in place with your team.",
  },
  {
    title: "Monitor",
    description: "Track system health, security, and spending to spot issues and guide ongoing improvements.",
  },
  {
    title: "Scale",
    description: "Adapt your IT, security, and processes as your team grows and business needs change.",
  },
];

function preventWidow(text: string) {
  const lastSpace = text.lastIndexOf(" ");

  if (lastSpace === -1) {
    return text;
  }

  return `${text.slice(0, lastSpace)}\u00A0${text.slice(lastSpace + 1)}`;
}

export default function Home() {
  return (
    <>
      <ScrollToTop showAfter={0.2} />
      <section className="relative overflow-hidden bg-background py-16 sm:py-22 lg:py-24">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[0.95fr_0.88fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="animate-text-reveal mb-5 text-pretty text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">
              IT services for modern businesses
            </p>
            <h1 className="animate-text-reveal max-w-4xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              IT that runs smoothly, stays secure,{" "}
              <span className="text-primary">and scales with you.</span>
            </h1>
            <p
              className="animate-text-reveal mt-6 max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg"
              style={{ animationDelay: "120ms" }}
            >
              {preventWidow("Managed IT, cybersecurity, cloud cost optimization, and AI automation for businesses in the US and UK.")}
            </p>
            <div
              className="animate-text-reveal mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "220ms" }}
            >
              <ButtonLink href="/assessment">
                Get Your Free IT Assessment
              </ButtonLink>
              <ButtonLink href="/services" variant="secondary">
                Explore Our Services
              </ButtonLink>
            </div>
          </div>
          <AiVisual />
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why businesses choose IAMM"
            title="AI That Works for Your Business."
            description="We don't add AI for the sake of it. We find where intelligent automation can make a real difference, saving time, reducing costs, and helping your business operate better."
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(([title, description]) => (
              <article
                key={title}
                className="animate-reveal rounded-lg border border-border bg-surface p-6 shadow-sm"
              >
                <h3 className="text-pretty text-lg font-semibold text-foreground">
                  {preventWidow(title)}
                </h3>
                <p className="mt-3 text-pretty leading-7 text-muted-foreground">
                  {preventWidow(description)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Services"
            title="Solutions Built to Move Your Business Forward."
            description="Keep your IT running smoothly, strengthen your security, control cloud costs, and simplify repetitive work with services built around your business."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our perspective"
            title="Less busywork. More room to do great work."
            description="What we believe better technology should do for the people behind your business."
            align="center"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {businessNeeds.map((need) => (
              <figure key={need.title} className="flex h-full flex-col rounded-lg border border-border bg-background p-7 shadow-sm">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="mb-5 h-9 w-9 text-primary/35" fill="currentColor">
                  <path d="M3 11c0-4 2-7 6-8v3c-2 1-3 2-3 4h4v10H3V11Zm11 0c0-4 2-7 6-8v3c-2 1-3 2-3 4h4v10h-7V11Z" />
                </svg>
                <blockquote className="flex-1 text-lg leading-8 text-foreground">
                  <p>&ldquo;{need.description}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3 border-t border-border pt-5">
                  <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="12" cy="8" r="3" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">IAMM Solutions</p>
                    <p className="mt-1 text-xs text-muted-foreground">{need.title}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Your tools, process, and review needs shape the outcome. Start with an assessment to find the best fit.</p>
            <ButtonLink href="/assessment" variant="secondary">Explore your opportunities</ButtonLink>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="How IAMM works" 
            title="From Problem to Progress."
            description="A clear approach to reliable IT, stronger security, controlled cloud costs, and smarter ways of working."
            align="center"
          />
          <div className="relative mt-14 grid gap-5 md:grid-cols-5">
            {processSteps.map((step, index) => (
              <article
                key={step.title}
                className="group animate-reveal relative overflow-hidden rounded-lg border border-border bg-surface p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 motion-reduce:transform-none"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-70 transition duration-300 group-hover:opacity-100" />
                <div className="relative mb-8 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-sm font-bold text-white shadow-lg shadow-primary/25 transition duration-300 group-hover:rotate-3 group-hover:scale-105 group-hover:bg-accent group-hover:text-secondary">
                  {index + 1}
                </div>
                <h3 className="relative text-pretty text-lg font-semibold text-foreground">
                  {preventWidow(step.title)}
                </h3>
                <p className="relative mt-3 text-pretty text-sm leading-6 text-muted-foreground">
                  {preventWidow(step.description)}
                </p>
                <div className="relative mt-6 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500 group-hover:w-full"
                    style={{ width: `${28 + index * 14}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <SectionHeading
            eyebrow="Free IT Assessment"
            title="Find out how your technology could work better."
            description="Share your IT support needs, security concerns, cloud spending, and workflow challenges. IAMM will review your priorities and identify practical next steps."
            align="center"
          />
          <ButtonLink href="/assessment" className="mt-8">
            Start Free IT Assessment
          </ButtonLink>
        </div>
      </section>

      <CtaBand
        title="Ready to explore a more intelligent operating model?"
        description="Start with the assessment or speak with IAMM about the workflows you want to improve."
        primaryHref="/assessment"
        primaryLabel="Free IT Assessment"
        secondaryHref="/contact"
        secondaryLabel="Contact IAMM"
      />
    </>
  );
}
