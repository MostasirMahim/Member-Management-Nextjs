import PromoCodeViewTable from "@/components/promo_code/PromoCodeViewTable";
import axiosInstance from "@/lib/axiosInstance";
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
    <div>
      <div className="mb-4 ">
        <h4 className="text-center font-bold text-3xl">
          All available promo codes
        </h4>
      </div>
      <PromoCodeViewTable data={responseData} />
    </div>
  );
}

export default PromoCodeViewPage;
