import ActivityLog from "@/components/activity_log/ActivityLog";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

import React from "react";

async function ActivityLogPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let responseData = {};
  try {
    const { data } = await axiosInstance.get(
      "/api/activity_log/v1/activity/all_user_activity/",
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
    <div className="max-h-full overflow-y-auto bg-slate-500">
      <ActivityLog data={responseData} />
    </div>
  );
}

export default ActivityLogPage;
