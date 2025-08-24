import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
import PaymentDetails from "@/components/member_financial_management/Payments/PaymentDetails";

export default async function SinglePaymentPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  const paymentId = params.id;
  console.log("Fetching payment with ID:", paymentId);
  let payment = null;

  try {
    const { data } = await axiosInstance.get(
      `/api/member_financial/v1/payments/${params.id}/`,
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    payment = data.data;
  } catch (error: any) {
    console.error(`Failed to fetch payment ID: ${params.id}`, error);
    // throw error;
    if (error.response) {
      // Axios server responded with error status
      throw new Error(error.response.data?.message || `Request failed with status code ${error.response.status}`);
    } else if (error.request) {
      // No response received from server
      throw new Error("No response from server");
    } else {
      // Other errors
      throw new Error(error.message || "Failed to fetch payment");
    }
  }

  

  return (
    <div className="p-6 space-y-6">
      <PaymentDetails payment={payment} />
    </div>
  );
}
