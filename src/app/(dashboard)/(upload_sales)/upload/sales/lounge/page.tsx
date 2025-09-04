import LoungeUploadForm from "@/components/upload/LoungeUploadForm";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import React from "react";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

async function LoungeSalesUploadPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let incomeParticularData = {};
  let receivedFromData = {};
  let { page } = await searchParams;
  page = page || "1";

  try {
    const [incomeRes, receivedFromRes] = await Promise.all([
      axiosInstance.get("/api/member_financial/v1/income/particular/", {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
      axiosInstance.get("/api/member_financial/v1/income/receiving_options/", {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
    ]);
    incomeParticularData = incomeRes.data;
    receivedFromData = receivedFromRes.data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error?.response?.data);
    console.log(error?.response?.status);
    if (error?.response?.status == 403) {
      redirect("/unauthorized");
    }
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }
  return (
    <div>
      <div>
        <h4 className="text-center font-bold text-3xl mb-4">
          Upload lounge sales file{" "}
        </h4>
      </div>
      <LoungeUploadForm
        incomeParticular={incomeParticularData}
        receivedFrom={receivedFromData}
      />
    </div>
  );
}

export default LoungeSalesUploadPage;
