import GroupDetails from "@/components/bulk_mail/GroupDetails";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

interface Props {
  params: Promise<{ id: string }>;
}

async function GroupDetailsPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let responseData = {};
  try {
    const { data } = await axiosInstance.get(
      `/api/mails/v1/email/groups/${id}/`,
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
      <div className="mb-4">
        <h4 className="text-center text-4xl font-bold">Group Details </h4>
      </div>
      <GroupDetails data={responseData} />
    </div>
  );
}

export default GroupDetailsPage;
