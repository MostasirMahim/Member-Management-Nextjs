import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/lib/axiosInstance";
import { Users, Layers, Activity } from "lucide-react";
import { cookies } from "next/headers";

export async function KPICards() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let responseData: any = {};
  let kpis: any = {};
  try {
    const { data } = await axiosInstance.get(
      "/api/dashboard/v1/dashboard_cards/kpi/",
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    responseData = data;
    kpis = responseData.data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-full">
      <Card className="bg-white shadow-md rounded-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 p-4">
          <CardTitle className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Total Users</span>
          </CardTitle>
          {/* Optional: Add a small indicator or status */}
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-indigo-600 mb-1">
            {kpis.user_count}
          </div>
          <p className="text-sm text-gray-500">
            Total onboard users in the club
          </p>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-md rounded-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 p-4">
          <CardTitle className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Total Groups</span>
          </CardTitle>
          {/* Optional: Add a small indicator or status */}
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-indigo-600 mb-1">
            {kpis.group_count}
          </div>
          <p className="text-sm text-gray-500">Total created groups</p>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-md rounded-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 p-4">
          <CardTitle className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            <span>Active users today</span>
          </CardTitle>
          {/* Optional: Add a small indicator or status */}
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-indigo-600 mb-1">
            {kpis.active_user_today}
          </div>
          <p className="text-sm text-gray-500">Active users of today</p>
        </CardContent>
      </Card>
    </div>
  );
}
