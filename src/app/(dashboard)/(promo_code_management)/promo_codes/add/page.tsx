import PromoCodeAddForm from "@/components/promo_code/PromoCodeAddForm";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import React from "react";

async function AddPromoCodePage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let responseData = {};
  try {
    const { data } = await axiosInstance.get(
      `/api/promo_code/v1/promo_codes/categories/`,
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
      <div>
        <h4 className="font-bold text-center">Add a promo code</h4>
        <p className="text-center">
          You must give percentage or amount to discount. Both can't be present
          together in a single promo code.
        </p>
      </div>
      <PromoCodeAddForm categories={responseData} />
    </div>
  );
}

export default AddPromoCodePage;
