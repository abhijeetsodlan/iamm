import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Contact Submissions",
  description: "View IAMM contact form submissions.",
};

export default function AdminContactPage() {
  return <AdminDashboard view="contact" />;
}
