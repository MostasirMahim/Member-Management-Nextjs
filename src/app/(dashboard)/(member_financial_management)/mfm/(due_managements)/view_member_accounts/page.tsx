import ViewMemberAccountTable from "@/components/member_financial_management/due/ViewMemberAccountTable";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import React from "react";

interface Props {
  searchParams: any;
}

async function ViewMemberAccountsPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let { page } = await searchParams;
  page = page || "1";
  let responseData = {};
  try {
    const { data } = await axiosInstance.get(
      `/api/member_financial/v1/member_accounts/?page=${page}`,
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    responseData = data;
    console.log(responseData);
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return (
    <div>
      <div>
        <h4 className="text-center font-bold text-3xl mb-4">Member accounts</h4>
      </div>
      <ViewMemberAccountTable data={responseData} />
    </div>
  );
}

export default ViewMemberAccountsPage;
