
import CategoryTable from "@/components/products/categories/CategoryTable";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

export default async function CategoriesPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let categories = [];

  try {
    const { data } = await axiosInstance.get("/api/product/v1/products/categories/", {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });
    categories = data;
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }

  return (
    <div>
      <CategoryTable categories={categories} />
    </div>
  );
}
