import FacilityCart from "@/components/Facility/FacilityCart";
import ViewProductCart from "@/components/products/buy/ViewProductCart";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MemberIDs() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let member_ids = [];

  try {
    const { data } = await axiosInstance.get(
      "/api/member/v1/members/list/ids/",
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    member_ids = data.data;
  } catch (error: any) {
    console.log(error?.response?.status);
    if (error?.response?.status == 403) {
      redirect("/unauthorized");
    }
    console.error("Failed to fetch products", error);
  }

  return (
    <div >
      <FacilityCart member_ids={member_ids} />
    </div>
  );
}
