import { FacilitiesTable } from "@/components/Facility/FacilityTable";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import React from "react";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

async function ViewAllFacilitesPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let { page } = await searchParams;
  page = page || "1";
  let data: any = {};
  try {
    const response = await axiosInstance.get(
      `/api/facility/v1/facilities/?page=${page}&page_size=10`,
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    data = response.data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error);
    console.log(error.response?.data);
    console.log(error?.response?.status);
    if (error?.response?.status == 403) {
      redirect("/unauthorized");
    }
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }
  return (
    <div>
      <FacilitiesTable data={data?.data} pagination={data?.pagination} />
    </div>
  );
}

export default ViewAllFacilitesPage;
