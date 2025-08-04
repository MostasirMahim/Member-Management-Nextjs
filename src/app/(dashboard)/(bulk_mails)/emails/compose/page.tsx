import ComposeMailForm from "@/components/bulk_mail/ComposeMailForm";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

export default async function EmailEditor() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let configsData = {};
  let groupsData = {};

  try {
    const [configsRes, groupsRes] = await Promise.all([
      axiosInstance.get("/api/mails/v1/configs/", {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
      axiosInstance.get("/api/mails/v1/email/groups/", {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
    ]);
    configsData = configsRes.data;
    groupsData = groupsRes.data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response?.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }
  return (
    <div className="border rounded-md p-2">
      <div>
        <h4 className="text-2xl font-bold text-center mb-2">
          Compose your email
        </h4>
      </div>
      <ComposeMailForm configData={configsData} groupData={groupsData} />
    </div>
  );
}
