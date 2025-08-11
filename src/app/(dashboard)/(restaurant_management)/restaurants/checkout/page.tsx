import RestaurantCheckoutForm from "@/components/restaurant/RestaurantCheckoutForm";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

async function RestaurantItemCheckoutPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let memberData = {};
  let promoCodeData = {};

  try {
    const [memberRes, promoCodeRes] = await Promise.all([
      axiosInstance.get("/api/member/v1/members/list/", {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
      axiosInstance.get("/api/promo_code/v1/promo_codes/", {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
    ]);
    memberData = memberRes.data;
    promoCodeData = promoCodeRes.data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response?.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return (
    <div>
      <RestaurantCheckoutForm
        memberData={memberData}
        promoCodeData={promoCodeData}
      />
    </div>
  );
}

export default RestaurantItemCheckoutPage;
