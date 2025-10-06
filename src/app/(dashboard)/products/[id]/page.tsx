import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
import ProductDetails from "@/components/products/ProductDetails";
import { AlertCircle } from "lucide-react";

export default async function SingleProductPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let product = null;

  try {
    const { data } = await axiosInstance.get(
      `/api/product/v1/products/${params.id}/`,
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    product = data;
  } catch (error) {
    console.error(`Failed to fetch product ID: ${params.id}`, error);
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-600 max-w-md">
          We couldn’t find the product you’re looking for. It might have been
          removed, or the ID <span className="font-mono">{params.id}</span> is invalid.
        </p>
        <a
          href="/products"
          className="mt-6 inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Back to Products
        </a>
      </div>
    );
  }

  return (
    <div>
      <ProductDetails product={product} />
    </div>
  );
}
