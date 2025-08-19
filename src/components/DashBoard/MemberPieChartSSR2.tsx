import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import MemberPieChart2 from "./MemberPieChart2";

async function MemberPieChartSSR2() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let chartData: any = {};

  try {
    const { data } = await axiosInstance.get(
      "/api/dashboard/v1/membership_chart/pie_chart/",
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    chartData = data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response?.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }
  return (
    <div className="w-full overflow-x-auto ">
      <div>
        <h4 className="text-center">
          Membership types and its percentage of member are shown
        </h4>
      </div>

      <div>
        <MemberPieChart2 data={chartData.data} />
      </div>
    </div>
  );
}

export default MemberPieChartSSR2;
