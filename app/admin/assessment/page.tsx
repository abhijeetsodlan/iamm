import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Assessment Submissions",
  description: "View IAMM assessment form submissions.",
  path: "/admin/assessment",
  noIndex: true,
});

export default function AdminAssessmentPage() {
  return <AdminDashboard view="assessment" />;
}
