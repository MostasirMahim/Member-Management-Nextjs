import AppliedPromoCodeViewTable from "@/components/promo_code/AppliedPromoCodeViewTable";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import React from "react";

async function ViewAppliedPromoCodes() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let responseData = {};
  try {
    const { data } = await axiosInstance.get(
      `/api/promo_code/v1/applied_promo_codes/`,
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
        <h4 className="text-center font-bold text-3xl mb-4">
          View all applied promo codes
        </h4>
      </div>
      <AppliedPromoCodeViewTable data={responseData} />
    </div>
  );
}

export default ViewAppliedPromoCodes;
