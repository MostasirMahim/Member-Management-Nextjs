import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
import InvoiceTable from "@/components/member_financial_management/Invoices/InvoiceTable";

export default async function InvoicePage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let invoices = [];

  try {
    const { data } = await axiosInstance.get("/api/member_financial/v1/invoices/", {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });

    invoices = data;


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
      <InvoiceTable invoices={invoices} />
    </div>
  );
}
