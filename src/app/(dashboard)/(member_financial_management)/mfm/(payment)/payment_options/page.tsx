
import InvoicePaymentTable from "@/components/member_financial_management/Invoices/Payment/InvoicePaymentOptionsTable";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

export default async function PaymentOptionsPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let invoice_payment_options = [];

  try {
    const { data } = await axiosInstance.get("/api/member_financial/v1/payment/options/", {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });
    invoice_payment_options = data;
  } catch (error) {
    console.error("Failed to fetch invoice payment options", error);
  }

  return (
    <div>
      <InvoicePaymentTable invoice_payment_options={invoice_payment_options} />
    </div>
  );
}
