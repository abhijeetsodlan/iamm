import { ContactForm } from "@/components/forms/ContactForm";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact IAMM",
  description: "Contact IAMM to discuss AI automation, workflow optimization, business process automation, AI integrations, or a free business assessment.",
  path: "/contact",
  keywords: ["contact AI automation company", "AI automation consultation", "workflow automation consultation"],
});

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ plan?: string | string[]; request?: string | string[] }> }) {
  const params = await searchParams;
  const planNames: Record<string, string> = { essential: "Essential", business: "Business", premium: "Premium" };
  const plan = typeof params.plan === "string" && Object.hasOwn(planNames, params.plan) ? planNames[params.plan] : undefined;
  const projectRequest = params.request === "project";
  const quoteRequest = Boolean(plan) || params.request === "quote";
  const initialSubject = plan ? `${plan} plan quote request` : projectRequest ? "Project inquiry" : quoteRequest ? "IT support quote request" : "";
  const initialMessage = plan ? `I'm interested in the ${plan} plan.\n\nTeam size: \nNumber of devices: \nLocation / time zone: \nSupport needs: ` : "";
  return (
    <main className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="order-1 lg:order-1">
          <SectionHeading eyebrow={quoteRequest ? "Custom quote" : projectRequest ? "Projects" : "Contact"} title={quoteRequest ? "Find the right IT support for your business." : projectRequest ? "Let's talk about your project." : "Talk to IAMM about your technology needs."} description={quoteRequest ? "Tell us your team size, devices, and goals. We'll recommend the right plan within one business day." : "Share your IT support, security, cloud, or automation needs. IAMM will review your message and help identify practical next steps."} />
        </div>
        <div className="order-2 lg:order-2 lg:row-span-2">
          <ContactForm key={initialSubject} initialSubject={initialSubject} initialMessage={initialMessage} quoteRequest={quoteRequest} />
        </div>
        <div className="order-3 space-y-6 rounded-lg border border-border bg-muted p-6 lg:order-3">
          <div>
            <h2 className="font-semibold text-foreground">Connect with IAMM</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">We work with businesses in the US and UK. Call us, send an email, or connect on social platforms.</p>
            <div className="mt-5">
              <SocialLinks showLabels />
            </div>
          </div>
          <div className="border-t border-border pt-5">
            <h2 className="font-semibold text-foreground">Prefer a structured start?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">The assessment page is best when you already know which workflows are slowing the business down.</p>
            <ButtonLink href="/assessment" className="mt-4">Take Assessment</ButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
}
