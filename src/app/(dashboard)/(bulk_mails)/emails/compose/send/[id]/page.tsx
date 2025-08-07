import EmailMultipleGroupSend from "@/components/bulk_mail/EmailMultipleGroupSend";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import React from "react";

interface Props {
  params: Promise<{ id: string }>;
}

async function EmailSendMultipleGroupPage({ params }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  const { id } = await params;
  let responseData = {};
  try {
    const { data } = await axiosInstance.get(`/api/mails/v1/email/groups/`, {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });
    responseData = data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }
  return (
    <div>
      <EmailMultipleGroupSend data={responseData} composeId={id} />
    </div>
  );
}

export default EmailSendMultipleGroupPage;
