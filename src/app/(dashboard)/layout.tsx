"use client";

import AdminDashboard from "@/components/AdminDashboard";
import { LoadingDots } from "@/components/ui/loading";
import useAuthUser from "@/hooks/data/useAuthUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, isLoading } = useAuthUser();
  console.log("user in admin layout:", user);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading]);

  if (isLoading) return <LoadingDots />;
  if (!user) return null;

  return <AdminDashboard>{children}</AdminDashboard>;
}
