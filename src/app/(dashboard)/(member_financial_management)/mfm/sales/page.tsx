import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
import SalesTable from "@/components/member_financial_management/Sales/SalesTable";

export default async function SalesPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let salesData = [];

  try {
    const { data } = await axiosInstance.get("/api/member_financial/v1/sales/", {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });

    salesData = data;


  } catch (err: any) {
    if (err.response) {
      // Axios server responded with error status
      throw new Error(err.response.data?.message || `Request failed with status code ${err.response.status}`);
    } else if (err.request) {
      // No response received from server
      throw new Error("No response from server");
    } else {
      // Other errors
      throw new Error(err.message || "Failed to fetch invoices");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <SalesTable sales={salesData} />
    </div>
  );
}
