import { CtaBand } from "@/components/ui/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/lib/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Managed IT, Cybersecurity, Cloud & AI Services",
  description: "Explore managed IT services, cybersecurity, cloud cost optimization, and AI and workflow automation from IAMM Solutions for businesses in the US and UK.",
  path: "/services",
  keywords: ["managed IT services", "cybersecurity services", "cloud cost optimization", "AI workflow automation"],
});

export default function ServicesPage() {
  return (
    <>
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Services" title="IT that supports your business at every stage." description="Managed IT, cybersecurity, cloud cost optimization, and AI automation for businesses in the US and UK. Build a reliable foundation, protect what matters, and make everyday work simpler." />
        </div>
      </section>
      <section className="pb-20 sm:pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:px-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} detailed />
          ))}
        </div>
      </section>
      <CtaBand title="Not sure which service fits your business?" description="Start with a free IT assessment to review your support, security, cloud costs, and automation priorities." primaryHref="/assessment" primaryLabel="Free IT Assessment" secondaryHref="/contact" secondaryLabel="Talk to IAMM" />
    </>
  );
}
