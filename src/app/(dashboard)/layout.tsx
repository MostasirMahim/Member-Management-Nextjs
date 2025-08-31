"use server";
import AdminDashboard from "@/components/AdminDashboard";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboard>{children}</AdminDashboard>;
}
