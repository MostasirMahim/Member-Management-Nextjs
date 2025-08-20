
import IncomeReceivingOptionTable from "@/components/member_financial_management/Income/ReceivingOption/IncomeReceivingOptionTable";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

export default async function CategoriesPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let income_receiving_options = [];

  try {
    const { data } = await axiosInstance.get("/api/member_financial/v1/income/receiving_options/", {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });
    income_receiving_options = data;
  } catch (error) {
    console.error("Failed to fetch income receiving options", error);
  }

  return (
    <div className="p-6 space-y-6">
      <IncomeReceivingOptionTable income_receiving_options={income_receiving_options} />
    </div>
  );
}
