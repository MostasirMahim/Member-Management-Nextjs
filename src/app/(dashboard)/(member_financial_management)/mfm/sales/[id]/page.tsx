import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
import SalesDetails from "@/components/member_financial_management/Sales/SalesDetails";
import { AlertCircle } from "lucide-react";

export default async function SingleSalesPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  const salesId = params.id;
  console.log("Fetching sales with ID:", salesId);
  let sales = null;

  try {
    const { data } = await axiosInstance.get(
      `/api/member_financial/v1/sales/${params.id}/`,
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    sales = data.data;
  } catch (error: any) {
    console.error(`Failed to fetch sales ID: ${params.id}`, error);
    // throw error;
    if (error.response) {
      // Axios server responded with error status
      throw new Error(error.response.data?.message || `Request failed with status code ${error.response.status}`);
    } else if (error.request) {
      // No response received from server
      throw new Error("No response from server");
    } else {
      // Other errors
      throw new Error(error.message || "Failed to fetch invoice");
    }
  }

  

  return (
    <div className="p-6 space-y-6">
      <SalesDetails sale={sales} />
    </div>
  );
}
