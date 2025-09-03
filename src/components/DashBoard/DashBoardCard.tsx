import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import DashboardStats from "./DashboardStats";

interface Props {
  searchParams: Promise<{
    created_at?: string;
    created_at_after?: string;
    created_at_before?: string;
  }>;
}

async function DashBoardCard({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  if(authToken === '') return null;
  const { created_at, created_at_after, created_at_before } =
    await searchParams;

  let responseData = {};
  try {
    let url = `/api/dashboard/v1/dashboard_cards/`;
    if (created_at) {
      url += `?created_at=${created_at}`;
    } else if (created_at_after) {
      url += `?created_at_after=${created_at_after}`;
    } else if (created_at_before) {
      url += `?created_at_before=${created_at_before}`;
    }

    const { data } = await axiosInstance.get(url, {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });
    responseData = data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error?.response?.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }
  return (
    <div>
      {authToken && <DashboardStats data={responseData} /> }
    </div>
  );
}

export default DashBoardCard;
