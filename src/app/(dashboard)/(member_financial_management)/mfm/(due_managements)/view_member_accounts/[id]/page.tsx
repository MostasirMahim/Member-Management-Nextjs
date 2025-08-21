import { MemberAccountStatement } from "@/components/member_financial_management/due/ViewMemberAccountSpecific";
import axiosInstance from "@/lib/axiosInstance";

import { cookies } from "next/headers";

interface Props {
  params: Promise<{ id: string }>;
}
async function ViewMemberAccountSpecificPage({ params }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  const { id } = await params;
  let responseData: any = {};
  try {
    const { data } = await axiosInstance.get(
      `/api/member_financial/v1/member_accounts/${id}/`,
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
      <MemberAccountStatement data={responseData.data} />
    </div>
  );
}

export default ViewMemberAccountSpecificPage;
