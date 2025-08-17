
import PricesTable from "@/components/products/prices/PricesTable";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

export default async function ProductsPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let product_prices = [];

  try {
    const { data } = await axiosInstance.get("/api/product/v1/products/prices/", {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });
    product_prices = data;
  } catch (error) {
    console.error("Failed to fetch products", error);
  }

  return (
    <div className="p-6 space-y-6">
      {/* User Input (select box etc) */}
      {/* <CategorySelect categories={categories} /> */}

      {/* Show in Table */}
      <PricesTable productPrices={product_prices} />
    </div>
  );
}
