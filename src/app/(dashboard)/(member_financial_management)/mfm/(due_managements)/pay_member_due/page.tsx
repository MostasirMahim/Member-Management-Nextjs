import ViewMemberDueTable from "@/components/member_financial_management/due/ViewMemberDueTable";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

interface Props {
  searchParams: any;
}

async function PayMemberDue({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let { page } = await searchParams;
  page = page || "1";
  let responseData = {};
  try {
    const { data } = await axiosInstance.get(
      `/api/member_financial/v1/member_dues/?page=${page}`,
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
      <div className="text-center">
        <h4 className="text-2xl font-bold mb-4">Member Dues</h4>
      </div>
      <ViewMemberDueTable data={responseData} />
    </div>
  );
}

export default PayMemberDue;
