import PromoCodeViewTable from "@/components/promo_code/PromoCodeViewTable";
import RefreshButton from "@/components/utils/RefreshButton";
import axiosInstance from "@/lib/axiosInstance";
import { Layers } from "lucide-react";
import { cookies } from "next/headers";

async function PromoCodeViewPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let responseData = {};
  try {
    const { data } = await axiosInstance.get(
      `/api/promo_code/v1/promo_codes/`,
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    responseData = data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return (
    <div className="w-full bg-background space-y-6">
       <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6" />
            <span className="text-2xl font-bold">All available promo codes</span>
          </div>
          <RefreshButton />
        </div>
      <PromoCodeViewTable data={responseData} />
    </div>
  );
}

export default PromoCodeViewPage;
