import type { Metadata } from "next";
import { AssessmentForm } from "@/components/forms/AssessmentForm";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Free AI Business Assessment",
  description: "Submit a frontend-only AI business assessment request for IAMM to review in a future backend phase.",
};

export default function AssessmentPage() {
  return (
    <main className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="order-1 lg:order-1">
          <SectionHeading eyebrow="Free assessment" title="Discover where AI can improve your business." description="Use this structured assessment to describe your team, tools, bottlenecks, and automation goals. Backend submission will be connected later." />
        </div>
        <div className="order-2 lg:order-2 lg:row-span-2">
          <AssessmentForm />
        </div>
        <div className="order-3 rounded-lg border border-border bg-muted p-6 lg:order-3">
          <h2 className="font-semibold text-foreground">What this helps clarify</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <li>High-friction processes that are good candidates for automation.</li>
            <li>Existing systems IAMM may need to integrate with later.</li>
            <li>Business outcomes that matter before any technology is recommended.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
