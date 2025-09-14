
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
  } catch (err: any) {
    if (err.response) {
      // Axios server responded with error status
      throw new Error(err.response.data?.message || `Request failed with status code ${err.response.status}`);
    } else if (err.request) {
      // No response received from server
      throw new Error("No response from server");
    } else {
      // Other errors
      throw new Error(err.message || "Failed to fetch products");
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl overflow-x-auto">
     

      {/* Show in Table */}
      <ProductTable products={products} />
    </div>
  );
}

