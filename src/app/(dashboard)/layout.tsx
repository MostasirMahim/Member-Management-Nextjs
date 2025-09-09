"use server";
import DashboardLayout from "@/components/home/DashboardLayout";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
