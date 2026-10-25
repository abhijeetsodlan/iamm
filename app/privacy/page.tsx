import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "Read IAMM's privacy policy for information about how business inquiries, assessment details, and website data are handled.",
  path: "/privacy",
  keywords: ["IAMM privacy policy", "AI automation privacy"],
});

export default function PrivacyPage() {
  return (
    <main className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Privacy Policy</h1>
        <div className="mt-8 space-y-5 text-muted-foreground">
          <p>IAMM collects information submitted through contact and assessment forms so the team can respond to business inquiries and evaluate automation opportunities.</p>
          <p>Information may include name, email address, phone number, company details, website, business challenges, tools in use, and automation goals.</p>
          <p>IAMM uses this information to communicate with you, understand your request, improve services, and maintain secure business records.</p>
          <p>IAMM does not sell personal information. Access to submitted information is limited to authorized administrators.</p>
          <p>The IAMM AI chat sends your messages and recent conversation context to Google Gemini to generate replies. IAMM does not save chat transcripts to its submissions database; the conversation stays in page memory until you clear it or reload. Google processes chat content under its own terms and privacy practices, and free-tier content may be used to improve its products. Do not share passwords, payment information, or confidential business details in chat.</p>
          <p>AI replies can be inaccurate and do not form a service agreement. Contact IAMM to confirm pricing, availability, and support commitments.</p>
        </div>
      </div>
    </main>
  );
}
