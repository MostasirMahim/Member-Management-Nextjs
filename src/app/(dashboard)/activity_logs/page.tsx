export const dynamic = "force-dynamic";
export const revalidate = 0;
import ActivityLog from "@/components/activity_log/ActivityLog";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

async function ActivityLogPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let { page } = await searchParams;
  page = page || "1";
  let responseData = {};
  try {
    const { data } = await axiosInstance.get(
      `/api/activity_log/v1/activity/all_user_activity/?page=${page}`,
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
    <div className="max-h-full w-full ">
      <ActivityLog data={responseData} />
    </div>
  );
}

export default ActivityLogPage;
