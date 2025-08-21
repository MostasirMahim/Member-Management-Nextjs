import PaymentForm from "@/components/member_financial_management/Invoices/Payment/Invoice/PaymentInvoice";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let invoices: any[] = [];
  let paymentMethods: any[] = [];
  let incomeParticulars: any[] = [];
  let receivedFromList: any[] = [];

  try {
    const [invoiceRes, paymentRes, incomeRes, receivedRes] = await Promise.all([
      axiosInstance.get("/api/member_financial/v1/invoices/?fields=id,invoice_number", {
        headers: { Cookie: `access_token=${authToken}` },
      }),
      axiosInstance.get("/api/member_financial/v1/payment/options/?fields=id,name", {
        headers: { Cookie: `access_token=${authToken}` },
      }),
      axiosInstance.get("/api/member_financial/v1/income/particular/?fields=id,name", {
        headers: { Cookie: `access_token=${authToken}` },
      }),
      axiosInstance.get("/api/member_financial/v1/income/receiving_options/?fields=id,name", {
        headers: { Cookie: `access_token=${authToken}` },
      }),
    ]);

    invoices = invoiceRes.data?.data || [];
    paymentMethods = paymentRes.data?.data || [];
    incomeParticulars = incomeRes.data?.data || [];
    receivedFromList = receivedRes.data?.data || [];

  } catch (error) {
    console.error(" Failed to fetch payment form data:", error);
    // fallback empty arrays already declared
  }

  return (
    <PaymentForm
      invoices={invoices}
      paymentMethods={paymentMethods}
      incomeParticulars={incomeParticulars}
      receivedFromList={receivedFromList}
    />
  );
}
