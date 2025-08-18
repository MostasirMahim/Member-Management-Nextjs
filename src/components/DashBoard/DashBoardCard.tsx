import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import DashboardStats from "./DashboardStats";

async function DashBoardCard() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let responseData = {};
  try {
    const { data } = await axiosInstance.get(
      `/api/dashboard/v1/dashboard_cards/`,
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
      <DashboardStats data={responseData} />
    </div>
  );
}

export default DashBoardCard;
