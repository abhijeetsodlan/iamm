import { AiVisual } from "@/components/home/AiVisual";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/lib/site";

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

const processSteps = [
  {
    title: "Discover",
    description: "Map your goals, bottlenecks, tools, and the manual work slowing teams down.",
  },
  {
    title: "Analyze",
    description: "Prioritize automation opportunities by effort, impact, risk, and business value.",
  },
  {
    title: "Automate",
    description: "Build focused AI workflows that connect cleanly with the systems you already use.",
  },
  {
    title: "Optimize",
    description: "Tune the experience, reduce friction, and improve reliability with real feedback.",
  },
  {
    title: "Scale",
    description: "Extend what works into repeatable systems your business can keep growing with.",
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
              AI automation for modern businesses
            </p>
            <h1 className="animate-text-reveal max-w-4xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Automate what slows you down.{" "}
              <span className="text-primary">Accelerate what matters.</span>
            </h1>
            <p
              className="animate-text-reveal mt-6 max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg"
              style={{ animationDelay: "120ms" }}
            >
              {preventWidow("IAMM helps businesses identify opportunities, automate repetitive processes, and integrate intelligent AI solutions that save time, reduce costs, and create room for growth.")}
            </p>
            <div
              className="animate-text-reveal mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "220ms" }}
            >
              <ButtonLink href="/assessment">
                Get Your Free AI Assessment
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
            description="From intelligent automation and AI integration to custom business solutions, IAMM helps you simplify operations, eliminate repetitive work, and build systems that scale with your business."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="How IAMM works" 
            title="From Problem to Progress."
            description="A practical process for turning business friction into intelligent systems your team can trust."
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
                <div className="absolute right-4 top-4 text-5xl font-semibold leading-none text-primary/[0.08] transition duration-300 group-hover:scale-110 group-hover:text-primary/15">
                  {String(index + 1).padStart(2, "0")}
                </div>
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
            eyebrow="Free AI Business Assessment"
            title="Find out where AI can improve your business."
            description="Share your current challenges and workflows. IAMM will use the assessment structure to identify promising areas for automation when backend review is added."
            align="center"
          />
          <ButtonLink href="/assessment" className="mt-8">
            Start Free Assessment
          </ButtonLink>
        </div>
      </section>

      <CtaBand
        title="Ready to explore a more intelligent operating model?"
        description="Start with the assessment or speak with IAMM about the workflows you want to improve."
        primaryHref="/assessment"
        primaryLabel="Start Assessment"
        secondaryHref="/contact"
        secondaryLabel="Contact IAMM"
      />
    </>
  );
}






