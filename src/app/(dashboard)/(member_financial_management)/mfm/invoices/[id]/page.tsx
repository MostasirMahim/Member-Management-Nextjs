import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
import InvoiceDetails from "@/components/member_financial_management/Invoices/InvoiceDetails";
import { AlertCircle } from "lucide-react";

export default async function SingleInvoicePage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  const invoiceId = params.id;
  console.log("Fetching invoice with ID:", invoiceId);
  let invoice = null;

  try {
    const { data } = await axiosInstance.get(
      `/api/member_financial/v1/invoices/${params.id}/`,
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    invoice = data.data;
  } catch (error: any) {
    console.error(`Failed to fetch invoice ID: ${params.id}`, error);
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
      <InvoiceDetails invoice={invoice} />
    </div>
  );
}
