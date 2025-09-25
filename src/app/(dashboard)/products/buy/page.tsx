
import ViewProductCart from "@/components/products/buy/ViewProductCart";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

export default async function MemberIDs() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let member_ids = [];

  try {
    const { data } = await axiosInstance.get("/api/member/v1/members/list/ids/", {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });
    member_ids = data.data;
  } catch (error) {
    console.error("Failed to fetch products", error);
  }

  return (
    <div>
      <ViewProductCart member_ids={member_ids} />
    </div>
  );
}
