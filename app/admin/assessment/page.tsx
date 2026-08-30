import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Assessment Submissions",
  description: "View IAMM assessment form submissions.",
};

export default function AdminAssessmentPage() {
  return <AdminDashboard view="assessment" />;
}
