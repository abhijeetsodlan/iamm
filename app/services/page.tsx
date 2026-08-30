import { CtaBand } from "@/components/ui/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/lib/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "AI Automation Services",
  description: "Explore IAMM services for AI automation, business process automation, AI integration, workflow optimization, custom AI solutions, and digital transformation.",
  path: "/services",
  keywords: ["AI automation services", "AI integration services", "business process automation services"],
});

export default function ServicesPage() {
  return (
    <>
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Services" title="AI, automation, and digital transformation services built around real operations." description="IAMM helps businesses identify, design, and implement practical technology improvements across teams, tools, and customer journeys." />
        </div>
      </section>
      <section className="pb-20 sm:pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:px-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} detailed />
          ))}
        </div>
      </section>
      <CtaBand title="Not sure which service fits your business?" description="The free assessment is designed to identify the workflows where AI and automation can create the clearest value." primaryHref="/assessment" primaryLabel="Take Free Assessment" secondaryHref="/contact" secondaryLabel="Talk to IAMM" />
    </>
  );
}
