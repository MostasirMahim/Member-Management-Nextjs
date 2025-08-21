import PayDueForm from "@/components/member_financial_management/due/PayDueForm";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

interface Props {
  params: Promise<{ id: string }>;
}

async function PayMemberDue({ params }: Props) {
  const { id } = await params;
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let responseData: any = {};
  try {
    const { data } = await axiosInstance.get(
      "/api/member_financial/v1/payment/options/?fields=id,name",
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
      <div>
        <h4 className="text-center font-bold text-3xl mb-3">Pay member due</h4>
      </div>
      <PayDueForm data={responseData.data} due_id={id} />
    </div>
  );
}

export default PayMemberDue;
