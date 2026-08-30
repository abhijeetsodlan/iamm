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

export default function ContactPage() {
  return (
    <main className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="order-1 lg:order-1">
          <SectionHeading eyebrow="Contact" title="Talk to IAMM about your next intelligent workflow." description="Share what you are trying to improve. IAMM will review your message and help identify practical automation opportunities." />
        </div>
        <div className="order-2 lg:order-2 lg:row-span-2">
          <ContactForm />
        </div>
        <div className="order-3 space-y-6 rounded-lg border border-border bg-muted p-6 lg:order-3">
          <div>
            <h2 className="font-semibold text-foreground">Connect with IAMM</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Reach us by email or follow IAMM on social platforms.</p>
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
