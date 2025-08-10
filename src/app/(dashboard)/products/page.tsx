
import ProductTable from "@/components/products/ProductTable";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

export default async function ProductsPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let products = [];

  try {
    const { data } = await axiosInstance.get("/api/product/v1/products/", {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });
    products = data;
  } catch (error) {
    console.error("Failed to fetch products", error);
  }

  return (
    <div className="p-6 space-y-6">
      {/* User Input (select box etc) */}
      {/* <CategorySelect categories={categories} /> */}

      {/* Show in Table */}
      <ProductTable products={products} />
    </div>
  );
}
