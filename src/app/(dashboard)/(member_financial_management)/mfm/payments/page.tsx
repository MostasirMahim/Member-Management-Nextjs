import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
import PaymentTable from "@/components/member_financial_management/Payments/PaymentTable";

export default async function SalesPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let paymentsData = [];

  try {
    const { data } = await axiosInstance.get("/api/member_financial/v1/payments/", {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });

    paymentsData = data.data;


  } catch (err: any) {
    if (err.response) {
      // Axios server responded with error status
      throw new Error(err.response.data?.message || `Request failed with status code ${err.response.status}`);
    } else if (err.request) {
      // No response received from server
      throw new Error("No response from server");
    } else {
      // Other errors
      throw new Error(err.message || "Failed to fetch payments");
    }
  }

  return (
    <div>
      <PaymentTable payments={paymentsData} />
    </div>
  );
}
