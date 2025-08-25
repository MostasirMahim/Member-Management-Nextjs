// "use client";

// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useMutation } from "@tanstack/react-query";
// import axiosInstance from "@/lib/axiosInstance";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";

// import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import axios from "axios";

// interface InvoiceData {
//   id: number;
//   invoice_number: string;
//   total_amount: string;
//   paid_amount: string;
//   balance_due: string;
//   status: string;
//   currency: string;
// }
// interface InvoiceWithData {
//   data: InvoiceData;
// }
// type Invoice = InvoiceData | InvoiceWithData;

// interface PaymentFormProps {
//   invoice?: Invoice | null;
//   invoices: InvoiceData[];
//   paymentMethods: { id: number; name: string }[];
//   incomeParticulars: { id: number; name: string }[];
//   receivedFromList: { id: number; name: string }[];
// }

// // Zod Schema
// const formSchema = z.object({
//   invoice_id: z.number().min(1, "Invoice is required"),
//   payment_method: z.number().min(1, "Payment method is required"),
//   income_particular: z.number().min(1, "Income particular is required"),
//   received_from: z.number().min(1, "Received from is required"),
//   amount: z.preprocess((val) => {
//     if (typeof val === "string") return Number(val);
//     return val;
//   }, z.number().min(1, "Amount must be greater than 0")),
//   adjust_from_balance: z.boolean().default(false),
// });

// type FormValues = z.infer<typeof formSchema>;

// export default function PaymentForm({
//   invoice,
//   invoices,
//   paymentMethods,
//   incomeParticulars,
//   receivedFromList,
// }: PaymentFormProps) {
//   const router = useRouter();

//   // Helper: extract invoiceData from invoice (handle both cases)
//   const getInvoiceData = (inv: Invoice | null | undefined): InvoiceData | null => {
//     if (!inv) return null;
//     if ("data" in inv) return inv.data;
//     return inv;
//   };

//   const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
//     getInvoiceData(invoice)
//   );

//   // React Hook Form setup
//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       invoice_id: selectedInvoice ? selectedInvoice.id : undefined,
//       amount: undefined,
//       payment_method: undefined,
//       income_particular: undefined,
//       received_from: undefined,
//       adjust_from_balance: false,
//     },
//   });

//   useEffect(() => {
//     const invData = getInvoiceData(invoice);
//     if (invData) {
//       setSelectedInvoice(invData);
//       form.setValue("invoice_id", invData.id, { shouldValidate: true });
//     }
//   }, [invoice, form]);

//   // API call with error handling
//   const mutation = useMutation({
//     mutationFn: async (data: FormValues) => {
//       return await axiosInstance.post(
//         "/api/member_financial/v1/payment/invoice/",
//         data
//       );
//     },
//     onSuccess: () => {
//       toast.success(" Payment submitted successfully!");
//       form.reset();
//       router.refresh();
//     },
//     onError: (error: any) => {
//       let message = "Failed to submit payment.";
//       if (axios.isAxiosError(error)) {
//         if (error.response) {
//           const status = error.response.status;
//           if (status === 400) {
//             if (error.response.data?.errors) {
//               const errors = error.response.data.errors;
//               message = Object.values(errors).flat().join("\n");
//             } else if (error.response.data?.detail) {
//               message = error.response.data.detail;
//             } else {
//               message = "Invalid request. Please check your input.";
//             }
//           } else if (status === 401) {
//             message = "Unauthorized. Please login again.";
//           } else if (status === 403) {
//             message = "You don’t have permission to perform this action.";
//           } else if (status === 404) {
//             message = "Requested resource not found.";
//           } else if (status >= 500) {
//             message = "Server error. Please try again later.";
//           }
//         } else if (error.request) {
//           message = "No response from server. Please check your connection.";
//         } else {
//           message = error.message || "Something went wrong.";
//         }
//       } else {
//         message = "An unexpected error occurred.";
//       }
//       toast.error(message);
//       console.error("Payment submission error:", error);
//     },
//   });

//   const onSubmit = (values: FormValues) => {
//     if (!selectedInvoice) {
//       toast.error("Please select an invoice first!");
//       return;
//     }
//     mutation.mutate({ ...values, invoice_id: selectedInvoice.id });
//   };

//   return (
//     <form
//       onSubmit={form.handleSubmit(onSubmit)}
//       className="max-w-3xl mx-auto space-y-6 p-6 shadow-lg rounded-xl border bg-white"
//     >
//       {/* Invoice Summary */}
//       {selectedInvoice && (
//         <Card className="shadow-md border border-gray-200">
//           <CardContent className="p-4 flex justify-between items-center">
//             <div>
//               <p className="text-lg font-semibold">
//                 Invoice: {selectedInvoice.invoice_number}
//               </p>
//               <p className="text-sm text-gray-500">
//                 Status:
//                 <Badge
//                   className={`ml-2 ${
//                     selectedInvoice.status === "paid"
//                       ? "bg-green-600"
//                       : selectedInvoice.status === "unpaid"
//                       ? "bg-red-600"
//                       : "bg-yellow-600"
//                   }`}
//                 >
//                   {selectedInvoice.status}
//                 </Badge>
//               </p>
//             </div>
//             <div className="text-right">
//               <p>
//                 <strong>Total:</strong> {selectedInvoice.total_amount}{" "}
//                 {selectedInvoice.currency}
//               </p>
//               <p>
//                 <strong>Paid:</strong> {selectedInvoice.paid_amount}{" "}
//                 {selectedInvoice.currency}
//               </p>
//               <p>
//                 <strong>Due:</strong> {selectedInvoice.balance_due}{" "}
//                 {selectedInvoice.currency}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Invoice Selector */}
//       {selectedInvoice ? (
//         <div className="space-y-2">
//           <Label>Invoice</Label>
//           <Input value={selectedInvoice.invoice_number} readOnly />
//           <input type="hidden" {...form.register("invoice_id")} />
//         </div>
//       ) : (
//         invoices.length > 0 && (
//           <div className="space-y-2">
//             <Label>Select Invoice</Label>
//             <Select
//               onValueChange={(val) => {
//                 const found = invoices.find((i) => i.id.toString() === val);
//                 setSelectedInvoice(found || null);
//                 form.setValue("invoice_id", Number(val), { shouldValidate: true });
//               }}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select an invoice" />
//               </SelectTrigger>
//               <SelectContent>
//                 {invoices.map((inv) => (
//                   <SelectItem key={inv.id} value={inv.id.toString()}>
//                     {inv.invoice_number}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {form.formState.errors.invoice_id && (
//               <p className="text-red-500 text-sm">
//                 {form.formState.errors.invoice_id.message as string}
//               </p>
//             )}
//           </div>
//         )
//       )}

//       {/* Payment Method */}
//       <div className="space-y-2">
//         <Label>Payment Method</Label>
//         <Select
//           onValueChange={(val) =>
//             form.setValue("payment_method", Number(val), { shouldValidate: true })
//           }
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select a payment method" />
//           </SelectTrigger>
//           <SelectContent>
//             {paymentMethods.map((pm) => (
//               <SelectItem key={pm.id} value={pm.id.toString()}>
//                 {pm.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {form.formState.errors.payment_method && (
//           <p className="text-red-500 text-sm">
//             {form.formState.errors.payment_method.message as string}
//           </p>
//         )}
//       </div>

//       {/* Income Particular */}
//       <div className="space-y-2">
//         <Label>Income Particular</Label>
//         <Select
//           onValueChange={(val) =>
//             form.setValue("income_particular", Number(val), { shouldValidate: true })
//           }
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select an income particular" />
//           </SelectTrigger>
//           <SelectContent>
//             {incomeParticulars.map((inc) => (
//               <SelectItem key={inc.id} value={inc.id.toString()}>
//                 {inc.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {form.formState.errors.income_particular && (
//           <p className="text-red-500 text-sm">
//             {form.formState.errors.income_particular.message as string}
//           </p>
//         )}
//       </div>

//       {/* Received From */}
//       <div className="space-y-2">
//         <Label>Received From</Label>
//         <Select
//           onValueChange={(val) =>
//             form.setValue("received_from", Number(val), { shouldValidate: true })
//           }
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select received from" />
//           </SelectTrigger>
//           <SelectContent>
//             {receivedFromList.map((rcv) => (
//               <SelectItem key={rcv.id} value={rcv.id.toString()}>
//                 {rcv.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {form.formState.errors.received_from && (
//           <p className="text-red-500 text-sm">
//             {form.formState.errors.received_from.message as string}
//           </p>
//         )}
//       </div>

//       {/* Amount */}
//       <div className="space-y-2">
//         <Label>Amount</Label>
//         <Input type="number" placeholder="Enter amount" {...form.register("amount")} />
//         {form.formState.errors.amount && (
//           <p className="text-red-500 text-sm">
//             {form.formState.errors.amount.message as string}
//           </p>
//         )}
//       </div>

//       {/* Adjust From Balance */}
//       <div className="flex items-center space-x-2">
//         <Checkbox
//           id="adjust_from_balance"
//           checked={form.watch("adjust_from_balance")}
//           onCheckedChange={(val) =>
//             form.setValue("adjust_from_balance", Boolean(val))
//           }
//         />
//         <Label htmlFor="adjust_from_balance">Adjust from Balance</Label>
//       </div>

//       {/* Submit */}
//       <div className="flex justify-end">
//         <Button type="submit" className="px-6 py-2 shadow-md" disabled={mutation.isPending}>
//           {mutation.isPending ? "Submitting..." : "Submit Payment"}
//         </Button>
//       </div>
//     </form>
//   );
// }

// ----------------------------------
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

interface InvoiceData {
  id: number;
  invoice_number: string;
  total_amount: string;
  paid_amount: string;
  balance_due: string;
  status: string;
}
interface InvoiceWithData {
  data: InvoiceData;
}
type Invoice = InvoiceData | InvoiceWithData;

interface PaymentFormProps {
  invoice?: Invoice | null;
  invoices: InvoiceData[];
  paymentMethods: { id: number; name: string }[];
  incomeParticulars: { id: number; name: string }[];
  receivedFromList: { id: number; name: string }[];
}

export default function PaymentForm({
  invoice,
  invoices,
  paymentMethods,
  incomeParticulars,
  receivedFromList,
}: PaymentFormProps) {
  const router = useRouter();

  const getInvoiceData = (
    inv: Invoice | null | undefined
  ): InvoiceData | null => {
    if (!inv) return null;
    if ("data" in inv) return inv.data;
    return inv;
  };

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    getInvoiceData(invoice)
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(invoices.length / pageSize);

  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const form = useForm({
    defaultValues: {
      invoice_id: selectedInvoice ? selectedInvoice.id : undefined,
      amount: 0,
      payment_method: "",
      income_particular: "",
      received_from: "",
      adjust_from_balance: false,
    },
  });

  useEffect(() => {
    const invData = getInvoiceData(invoice);
    if (invData) {
      setSelectedInvoice(invData);
      form.setValue("invoice_id", invData.id, { shouldValidate: true });
    }
  }, [invoice, form]);

  // Submit mutation
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return await axiosInstance.post(
        "/api/member_financial/v1/payment/invoice/",
        data
      );
    },
    onSuccess: () => {
      toast.success("Payment submitted successfully!");
      form.reset();
      setSelectedInvoice(null);
      router.refresh();
    },
    onError: (error: any) => {
      let message = "Failed to submit payment.";
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.data?.detail) {
            message = error.response.data.detail;
          }
        }
      }
      toast.error(message);
    },
  });

  const onSubmit = (values: any) => {
    if (!selectedInvoice) {
      toast.error("Please select an invoice first!");
      return;
    }
    mutation.mutate({ ...values, invoice_id: selectedInvoice.id });
  };

  const handleReset = () => {
    form.reset();
    setSelectedInvoice(null);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto space-y-6 p-6 shadow-lg rounded-xl border bg-white"
    >
      {/* Invoice Summary */}
      {selectedInvoice && (
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">
                Invoice: {selectedInvoice.invoice_number}
              </p>
              <p className="text-sm text-gray-500">
                Status:
                <Badge
                  className={`ml-2 ${
                    selectedInvoice.status === "paid"
                      ? "bg-green-600"
                      : selectedInvoice.status === "unpaid"
                      ? "bg-red-600"
                      : "bg-yellow-600"
                  }`}
                >
                  {selectedInvoice.status}
                </Badge>
              </p>
            </div>
            <div className="text-right">
              <p>
                <strong>Total:</strong> {selectedInvoice.total_amount}
              </p>
              <p>
                <strong>Paid:</strong> {selectedInvoice.paid_amount}
              </p>
              <p>
                <strong>Due:</strong> {selectedInvoice.balance_due}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Selector with Pagination */}
      {!selectedInvoice && invoices.length > 0 && (
        <div className="space-y-2">
          <Label>Select Invoice</Label>
          <Select
            onValueChange={(val) => {
              const found = invoices.find((i) => i.id.toString() === val);
              setSelectedInvoice(found || null);
              form.setValue("invoice_id", Number(val), {
                shouldValidate: true,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an invoice" />
            </SelectTrigger>
            <SelectContent>
              {paginatedInvoices.map((inv) => (
                <SelectItem key={inv.id} value={inv.id.toString()}>
                  {inv.invoice_number}
                </SelectItem>
              ))}
              {/* Pagination controls inside dropdown */}
              <div className="flex justify-center gap-1 flex-wrap px-2 py-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      type="button"
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </SelectContent>
          </Select>
          {form.formState.errors.invoice_id && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.invoice_id.message as string}
            </p>
          )}
        </div>
      )}

      {/* Payment Method */}
      <div className="space-y-2">
        <Label>Payment Method</Label>
        <Select
          onValueChange={(val) =>
            form.setValue("payment_method", val, {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a payment method" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((pm) => (
              <SelectItem key={pm.id} value={pm.id.toString()}>
                {pm.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Income Particular */}
      <div className="space-y-2">
        <Label>Income Particular</Label>
        <Select
          onValueChange={(val) =>
            form.setValue("income_particular", val, {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an income particular" />
          </SelectTrigger>
          <SelectContent>
            {incomeParticulars.map((inc) => (
              <SelectItem key={inc.id} value={inc.id.toString()}>
                {inc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Received From */}
      <div className="space-y-2">
        <Label>Received From</Label>
        <Select
          onValueChange={(val) =>
            form.setValue("received_from", val, {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select received from" />
          </SelectTrigger>
          <SelectContent>
            {receivedFromList.map((rcv) => (
              <SelectItem key={rcv.id} value={rcv.id.toString()}>
                {rcv.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label>Amount</Label>
        <Input
          type="number"
          placeholder="Enter amount"
          {...form.register("amount")}
        />
      </div>

      {/* Adjust From Balance */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="adjust_from_balance"
          checked={form.watch("adjust_from_balance")}
          onCheckedChange={(val) =>
            form.setValue("adjust_from_balance", Boolean(val))
          }
        />
        <Label htmlFor="adjust_from_balance">Adjust from Balance</Label>
      </div>

      {/* Submit & Reset */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="px-6 py-2 shadow-md"
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="px-6 py-2 shadow-md"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Submit Payment"}
        </Button>
      </div>
    </form>
  );
}
