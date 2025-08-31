"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
        if (error.response?.data?.detail) {
          message = error.response.data.detail;
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
      className="max-w-3xl mx-auto space-y-6 p-6 shadow-lg rounded-xl border 
                 bg-white text-gray-900 
                 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
    >
      {/* Invoice Summary */}
      {selectedInvoice && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">
                Invoice: {selectedInvoice.invoice_number}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Status:
                <Badge
                  className={`ml-2 ${
                    selectedInvoice.status === "paid"
                      ? "bg-green-600 text-white"
                      : selectedInvoice.status === "unpaid"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-600 text-white"
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
          <Label className="dark:text-gray-200">Select Invoice</Label>
          <Select
            onValueChange={(val) => {
              const found = invoices.find((i) => i.id.toString() === val);
              setSelectedInvoice(found || null);
              form.setValue("invoice_id", Number(val), {
                shouldValidate: true,
              });
            }}
          >
            <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
              <SelectValue placeholder="Select an invoice" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-gray-100">
              {paginatedInvoices.map((inv) => (
                <SelectItem key={inv.id} value={inv.id.toString()}>
                  {inv.invoice_number}
                </SelectItem>
              ))}
              {/* Pagination controls inside dropdown */}
              <div className="flex justify-center gap-1 flex-wrap px-2 py-2 border-t dark:border-gray-600">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="dark:border-gray-500 dark:text-gray-200"
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
                      className={`${
                        page === currentPage
                          ? "dark:bg-blue-600 dark:text-white"
                          : "dark:border-gray-500 dark:text-gray-200"
                      }`}
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
                  className="dark:border-gray-500 dark:text-gray-200"
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
        <Label className="dark:text-gray-200">Payment Method</Label>
        <Select
          onValueChange={(val) =>
            form.setValue("payment_method", val, { shouldValidate: true })
          }
        >
          <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
            <SelectValue placeholder="Select a payment method" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:text-gray-100">
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
        <Label className="dark:text-gray-200">Income Particular</Label>
        <Select
          onValueChange={(val) =>
            form.setValue("income_particular", val, { shouldValidate: true })
          }
        >
          <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
            <SelectValue placeholder="Select an income particular" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:text-gray-100">
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
        <Label className="dark:text-gray-200">Received From</Label>
        <Select
          onValueChange={(val) =>
            form.setValue("received_from", val, { shouldValidate: true })
          }
        >
          <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
            <SelectValue placeholder="Select received from" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:text-gray-100">
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
        <Label className="dark:text-gray-200">Amount</Label>
        <Input
          type="number"
          placeholder="Enter amount"
          className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
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
          className="dark:border-gray-500"
        />
        <Label htmlFor="adjust_from_balance" className="dark:text-gray-200">
          Adjust from Balance
        </Label>
      </div>

      {/* Submit & Reset */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="px-6 py-2 shadow-md dark:border-gray-500 dark:text-gray-200"
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="px-6 py-2 shadow-md dark:bg-blue-600 dark:hover:bg-blue-700"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Submit Payment"}
        </Button>
      </div>
    </form>
  );
}
