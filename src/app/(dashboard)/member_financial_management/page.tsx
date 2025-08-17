import { cookies } from 'next/headers';
import axiosInstance from "@/lib/axiosInstance";
import MemberFinancialTable from "@/components/member_financial_management/MemberFinancialTable";

export default async function InvoicePage () {
    const cookieStore = cookies();
    const authToken = cookieStore.get("access_token")?.value || "";

    let invoices = [];
    try {
        const { data } = await axiosInstance.get("/api/product/v1/invoices/", {
            headers: {
                Cookie: `access_token=${authToken}`,
            }
        });
        invoices = data;
    } catch (err) {
        console.error("Error fetching brands:", err);
    }
    console.log("Invoices:", invoices);
    return (
        <div className="p-6 space-y-6">
             
              <MemberFinancialTable invoices={invoices} />
        </div>
    );
}
