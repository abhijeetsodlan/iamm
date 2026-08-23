import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions placeholder for IAMM.",
};

export default function TermsPage() {
  return (
    <main className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <SectionHeading eyebrow="Legal" title="Terms & Conditions" description="This page is prepared for the final IAMM terms and conditions. Legal copy will be added before production launch." />
      </div>
    </main>
  );
}
