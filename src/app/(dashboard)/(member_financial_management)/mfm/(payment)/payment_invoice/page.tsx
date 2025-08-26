import PaymentForm from "@/components/member_financial_management/Invoices/Payment/Invoice/PaymentInvoice";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

// ---- API Endpoints Config ----
const ENDPOINTS = {
  invoice: (id: string) =>
    `/api/member_financial/v1/invoices/${id}?fields=id,invoice_number,total_amount,paid_amount,balance_due,status`,
  invoices: `/api/member_financial/v1/invoices/?fields=id,invoice_number,total_amount,paid_amount,balance_due,status`,
  paymentOptions: "/api/member_financial/v1/payment/options/?fields=id,name",
  incomeParticulars: "/api/member_financial/v1/income/particular/?fields=id,name",
  receivingOptions: "/api/member_financial/v1/income/receiving_options/?fields=id,name",
};

// ---- Data Fetcher ----
async function getPaymentPageData(authToken: string, invoiceId?: string) {
  const headers = { Cookie: `access_token=${authToken}` };

  try {
    if (invoiceId) {
      const [invoiceRes, paymentRes, incomeRes, receivedRes] = await Promise.all([
        axiosInstance.get(ENDPOINTS.invoice(invoiceId), { headers }),
        axiosInstance.get(ENDPOINTS.paymentOptions, { headers }),
        axiosInstance.get(ENDPOINTS.incomeParticulars, { headers }),
        axiosInstance.get(ENDPOINTS.receivingOptions, { headers }),
      ]);

      return {
        invoice: invoiceRes.data,
        invoices: [],
        paymentMethods: paymentRes.data?.data ?? [],
        incomeParticulars: incomeRes.data?.data ?? [],
        receivedFromList: receivedRes.data?.data ?? [],
      };
    }

    const [invoicesRes, paymentRes, incomeRes, receivedRes] = await Promise.all([
      axiosInstance.get(ENDPOINTS.invoices, { headers }),
      axiosInstance.get(ENDPOINTS.paymentOptions, { headers }),
      axiosInstance.get(ENDPOINTS.incomeParticulars, { headers }),
      axiosInstance.get(ENDPOINTS.receivingOptions, { headers }),
    ]);

    return {
      invoice: null,
      invoices: invoicesRes.data?.data ?? [],
      paymentMethods: paymentRes.data?.data ?? [],
      incomeParticulars: incomeRes.data?.data ?? [],
      receivedFromList: receivedRes.data?.data ?? [],
    };
  } catch (error) {
    console.error(" Failed to fetch payment page data:", error);
    throw error;
  }
}

// ---- Page Component ----
export default async function PaymentInvoicePage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const authToken = cookies().get("access_token")?.value ?? "";
  const invoiceId = searchParams?.id;

  const {
    invoice,
    invoices,
    paymentMethods,
    incomeParticulars,
    receivedFromList,
  } = await getPaymentPageData(authToken, invoiceId);

  return (
    <PaymentForm
      invoice={invoice}
      invoices={invoices}
      paymentMethods={paymentMethods}
      incomeParticulars={incomeParticulars}
      receivedFromList={receivedFromList}
    />
  );
}
