// import PaymentForm from "@/components/member_financial_management/Invoices/Payment/Invoice/PaymentInvoice";
// import axiosInstance from "@/lib/axiosInstance";
// import { cookies } from "next/headers";
// import { useSearchParams } from "next/navigation";


// export default async function Page() {
//   const cookieStore = cookies();
//   const authToken = cookieStore.get("access_token")?.value || "";
//   // const searchParams = useSearchParams();
//   // const invoiceId = searchParams.get("id");

//   // console.log("Invoice ID from query params:", invoiceId);
//   // console.log("searchParams:", searchParams);

//   let invoices: any[] = [];
//   let paymentMethods: any[] = [];
//   let incomeParticulars: any[] = [];
//   let receivedFromList: any[] = [];

//   try {
//     const [invoiceRes, paymentRes, incomeRes, receivedRes] = await Promise.all([
//       axiosInstance.get("/api/member_financial/v1/invoices/?fields=id,invoice_number", {
//         headers: { Cookie: `access_token=${authToken}` },
//       }),
//       axiosInstance.get("/api/member_financial/v1/payment/options/?fields=id,name", {
//         headers: { Cookie: `access_token=${authToken}` },
//       }),
//       axiosInstance.get("/api/member_financial/v1/income/particular/?fields=id,name", {
//         headers: { Cookie: `access_token=${authToken}` },
//       }),
//       axiosInstance.get("/api/member_financial/v1/income/receiving_options/?fields=id,name", {
//         headers: { Cookie: `access_token=${authToken}` },
//       }),
//     ]);

//     invoices = invoiceRes.data?.data || [];
//     paymentMethods = paymentRes.data?.data || [];
//     incomeParticulars = incomeRes.data?.data || [];
//     receivedFromList = receivedRes.data?.data || [];

//   } catch (error) {
//     console.error(" Failed to fetch payment form data:", error);
//     // fallback empty arrays already declared
//   }

//   return (
//     <PaymentForm
//       invoices={invoices}
//       paymentMethods={paymentMethods}
//       incomeParticulars={incomeParticulars}
//       receivedFromList={receivedFromList}
//     />
//   );
// }
// ----------------------------------------------------------

import PaymentForm from "@/components/member_financial_management/Invoices/Payment/Invoice/PaymentInvoice";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

async function getPaymentPageData(authToken: string, invoiceId?: string) {
  console.log("Fetching payment page data...", invoiceId);
  if (invoiceId) {
    const [invoiceRes, paymentRes, incomeRes, receivedRes] = await Promise.all([
      axiosInstance.get(
        `/api/member_financial/v1/invoices/${invoiceId}?fields=id,invoice_number,total_amount,paid_amount,balance_due,status`,
        { headers: { Cookie: `access_token=${authToken}` } }
      ),
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

    return {
      invoice: invoiceRes.data,
      invoices: [], 
      paymentMethods: paymentRes.data?.data || [],
      incomeParticulars: incomeRes.data?.data || [],
      receivedFromList: receivedRes.data?.data || [],
    };
  } else {
    // 🔹 যদি invoiceId না থাকে → সব invoice আনো
    const [invoicesRes, paymentRes, incomeRes, receivedRes] = await Promise.all([
      axiosInstance.get(
        `/api/member_financial/v1/invoices/?fields=id,invoice_number,total_amount,paid_amount,balance_due,status`,
        { headers: { Cookie: `access_token=${authToken}` } }
      ),
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

    return {
      invoice: null,
      invoices: invoicesRes.data?.data || [],
      paymentMethods: paymentRes.data?.data || [],
      incomeParticulars: incomeRes.data?.data || [],
      receivedFromList: receivedRes.data?.data || [],
    };
  }
}

export default async function PaymentInvoicePage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  const invoiceId = searchParams?.id;

  let invoiceData, invoicesList, paymentMethods, incomeParticulars, receivedFromList;

  try {
    const data = await getPaymentPageData(authToken, invoiceId);
    invoiceData = data.invoice;
    invoicesList = data.invoices;
    paymentMethods = data.paymentMethods;
    incomeParticulars = data.incomeParticulars;
    receivedFromList = data.receivedFromList;
    console.log("Fetched payment page data:", invoiceData);
  } catch (error) {
    console.error("Failed to fetch payment form data:", error);
  }

  return (
    <PaymentForm
      invoice={invoiceData}
      invoices={invoicesList}
      paymentMethods={paymentMethods}
      incomeParticulars={incomeParticulars}
      receivedFromList={receivedFromList}
    />
  );
}
