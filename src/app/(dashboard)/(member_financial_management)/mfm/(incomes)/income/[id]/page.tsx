import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
import IncomeDetails from "@/components/member_financial_management/Income/IncomeDetails";
import { AlertCircle } from "lucide-react";

export default async function SingleIncomePage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  const incomeId = params.id;
  console.log("Fetching income with ID:", incomeId);
  let income = null;

  try {
    const { data } = await axiosInstance.get(
      `/api/member_financial/v1/income/${params.id}/`,
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    income = data.data;
  } catch (error: any) {
    console.error(`Failed to fetch income ID: ${params.id}`, error);
    // throw error;
    if (error.response) {
      // Axios server responded with error status
      throw new Error(error.response.data?.message || `Request failed with status code ${error.response.status}`);
    } else if (error.request) {
      // No response received from server
      throw new Error("No response from server");
    } else {
      // Other errors
      throw new Error(error.message || "Failed to fetch income");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <IncomeDetails income={income} />
    </div>
  );
}
