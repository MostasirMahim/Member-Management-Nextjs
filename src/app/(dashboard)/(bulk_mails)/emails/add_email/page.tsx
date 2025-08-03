import EmailAddToGroupForm from "@/components/bulk_mail/AddEmailToGroup";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

async function AddEmailToGroupPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
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
      <div className="mb-4">
        <h4 className="text-center text-4xl font-bold">
          Add emails to a specific group
        </h4>
      </div>

      <EmailAddToGroupForm data={responseData} />
    </div>
  );
}

export default AddEmailToGroupPage;
