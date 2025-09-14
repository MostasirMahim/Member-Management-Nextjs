
import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
import IncomeTable from "@/components/member_financial_management/Income/IncomeTable";

export default async function IncomePage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let incomes = [];

  try {
    const { data } = await axiosInstance.get("/api/member_financial/v1/income/", {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });

    incomes = data;


  } catch (err: any) {
    if (err.response) {
      // Axios server responded with error status
      throw new Error(err.response.data?.message || `Request failed with status code ${err.response.status}`);
    } else if (err.request) {
      // No response received from server
      throw new Error("No response from server");
    } else {
      // Other errors
      throw new Error(err.message || "Failed to fetch incomes");
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl overflow-x-auto">
      <IncomeTable incomes={incomes} />
    </div>
  );
}
