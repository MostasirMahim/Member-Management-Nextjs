
import IncomeParticularTable from "@/components/member_financial_management/Income/Particular/IncomeParticularTable";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

export default async function IncomeParticularPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let income_particulars = [];

  try {
    const { data } = await axiosInstance.get("/api/member_financial/v1/income/particular/", {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });
    income_particulars = data;
  } catch (error) {
    console.error("Failed to fetch income particulars", error);
  }

  return (
    <div className="p-6 space-y-6">
     
      <IncomeParticularTable income_particulars={income_particulars} />
    </div>
  );
}
