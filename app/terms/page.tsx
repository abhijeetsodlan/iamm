import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Terms & Conditions",
  description: "Read the IAMM terms and conditions for using the website, submitting business inquiries, and requesting AI automation assessments.",
  path: "/terms",
  keywords: ["IAMM terms", "AI automation terms"],
});

export default function TermsPage() {
  return (
    <main className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Terms & Conditions</h1>
        <div className="mt-8 space-y-5 text-muted-foreground">
          <p>By using this website, you agree to use IAMM&apos;s content, forms, and communication channels for lawful business purposes only.</p>
          <p>Submitting a contact form or assessment request does not create a client relationship, service agreement, or guaranteed project commitment.</p>
          <p>IAMM may review submitted information to understand your business needs and recommend possible AI automation, workflow, or digital solution options.</p>
          <p>All website content is provided for general information and may be updated as IAMM services, policies, and offerings evolve.</p>
        </div>
      </div>
    </main>
  );
}

