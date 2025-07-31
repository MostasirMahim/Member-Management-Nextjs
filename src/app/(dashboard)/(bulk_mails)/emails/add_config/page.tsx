import EmailConfigTable from "@/components/bulk_mail/EmailConfigTable";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { MailPlus } from "lucide-react";
import { cookies } from "next/headers";
import React from "react";

async function EmailConfigPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let responseData = {};
  try {
    const { data } = await axiosInstance.get(`/api/mails/v1/configs/`, {
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
      <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
        <div>
          <h2 className="font-bold text-4xl">Email configurations</h2>
        </div>
        <div>
          <Button variant="outline" size="lg">
            <MailPlus /> Create configurations
          </Button>
        </div>
      </div>

      <EmailConfigTable data={responseData} />
    </div>
  );
}

export default EmailConfigPage;
