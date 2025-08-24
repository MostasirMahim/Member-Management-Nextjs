import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
import { TransactionReceipt } from "@/components/member_financial_management/Transections/TransactionDetails";

export default async function SingleTransactionPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  const transactionId = params.id;
  console.log("Fetching transaction with ID:", transactionId);
  let transaction = null;

  try {
    const { data } = await axiosInstance.get(
      `/api/member_financial/v1/transactions/${params.id}/`,
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    transaction = data.data;
  } catch (error: any) {
    console.error(`Failed to fetch transaction ID: ${params.id}`, error);
    // throw error;
    if (error.response) {
      // Axios server responded with error status
      throw new Error(
        error.response.data?.message ||
          `Request failed with status code ${error.response.status}`
      );
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
      <TransactionReceipt data={transaction} />
    </div>
  );
}
