import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy placeholder for IAMM.",
};

export default function PrivacyPage() {
  return (
    <main className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <SectionHeading eyebrow="Legal" title="Privacy Policy" description="This page is prepared for the final IAMM privacy policy. Legal copy will be added before production launch." />
      </div>
    </main>
  );
}
