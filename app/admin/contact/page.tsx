import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact Submissions",
  description: "View IAMM contact form submissions.",
  path: "/admin/contact",
  noIndex: true,
});

export default function AdminContactPage() {
  return <AdminDashboard view="contact" />;
}
