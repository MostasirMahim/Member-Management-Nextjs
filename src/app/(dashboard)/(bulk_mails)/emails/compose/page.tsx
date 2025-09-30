import ComposeMailForm from "@/components/bulk_mail/ComposeMailForm";
import axiosInstance from "@/lib/axiosInstance";
import { MailPlus } from "lucide-react";
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
    <div>
      <div className="flex items-start gap-4 border-b border-border/50 pb-6">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/20">
          <MailPlus className="size-6 text-primary" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Compose Email
          </h2>
          <p className="mt-1.5 text-pretty text-sm text-muted-foreground sm:text-base">
            Create and send your email message to recipients
          </p>
        </div>
      </div>
      <ComposeMailForm configData={configsData} groupData={groupsData} />
    </div>
  );
}
