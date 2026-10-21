import { AssessmentForm } from "@/components/forms/AssessmentForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free IT Assessment",
  description: "Request a free IAMM IT assessment to review your IT support, cybersecurity, cloud spending, and automation needs for your business in the US or UK.",
  path: "/assessment",
  keywords: ["free IT assessment", "technology review", "cybersecurity assessment", "cloud cost review"],
});

export default function AssessmentPage() {
  return (
    <main className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="order-1 lg:order-1">
          <SectionHeading eyebrow="Free IT Assessment" title="Get a clearer view of your technology needs." description="Tell us about your IT support, security concerns, cloud spending, and automation goals. IAMM will review your priorities and identify practical next steps." />
        </div>
        <div className="order-2 lg:order-2 lg:row-span-2">
          <AssessmentForm />
        </div>
        <div className="order-3 rounded-lg border border-border bg-muted p-6 lg:order-3">
          <h2 className="font-semibold text-foreground">What this helps clarify</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <li>IT support gaps and systems that need attention.</li>
            <li>Security priorities and backup or recovery needs.</li>
            <li>Cloud spending and opportunities to reduce waste.</li>
            <li>Repetitive processes that could benefit from automation.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
