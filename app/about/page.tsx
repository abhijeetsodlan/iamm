import { CtaBand } from "@/components/ui/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About IAMM",
  description: "Learn how IAMM helps businesses identify practical AI automation opportunities, improve workflows, and implement digital systems that support growth.",
  path: "/about",
  keywords: ["AI automation partner", "business workflow consulting", "automation strategy"],
});

const approach = ["Understand", "Analyze", "Build", "Implement", "Optimize"];
const why = [
  "Business-first recommendations before tools or models are selected.",
  "Clean implementation plans designed for international B2B teams.",
  "Practical automation that improves how work actually moves through the company.",
  "Implementation-minded systems designed to connect cleanly with real business tools.",
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="About IAMM" title="A practical AI and automation partner for businesses modernizing how work gets done." description="IAMM focuses on intelligent digital systems that reduce repetitive work, improve decisions, and create better customer and team experiences." />
        </div>
      </section>
      <section className="pb-20 sm:pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-8">
          <article className="rounded-lg border border-border bg-surface p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground">Who we are</h2>
            <p className="mt-4 leading-7 text-muted-foreground">IAMM is an AI, automation, and digital solutions company helping businesses turn operational complexity into clear, scalable systems. The work starts with understanding business context, then applying technology where it can create durable value.</p>
          </article>
          <article className="rounded-lg border border-border bg-surface p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground">Our mission</h2>
            <p className="mt-4 leading-7 text-muted-foreground">Our mission is to help businesses use technology intelligently: reduce repetitive work, improve efficiency, support better decisions, scale operations, and improve customer experience.</p>
          </article>
        </div>
      </section>
      <section className="bg-muted py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Approach" title="Built around the work, not around hype." align="center" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {approach.map((item, index) => (
              <div key={item} className="rounded-lg border border-border bg-surface p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">{index + 1}</div>
                <h3 className="font-semibold text-foreground">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Why IAMM" title="Focused, believable, and implementation-minded." />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {why.map((item) => (
              <div key={item} className="rounded-lg border border-border bg-surface p-6 shadow-sm">
                <p className="leading-7 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title="Explore what AI could improve in your business." description="Start with the free assessment or contact IAMM to discuss a specific workflow or digital initiative." primaryHref="/assessment" primaryLabel="Start Assessment" secondaryHref="/contact" secondaryLabel="Contact IAMM" />
    </>
  );
}

