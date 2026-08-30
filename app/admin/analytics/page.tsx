import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Analytics",
  description: "View IAMM form submission analytics.",
  path: "/admin/analytics",
  noIndex: true,
});

export default function AdminAnalyticsPage() {
  return <AdminDashboard view="analytics" />;
}
