"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  invoice_id: z.number().min(1, "Invoice is required"),
  payment_method: z.number().min(1, "Payment method is required"),
  amount: z.preprocess((val) => {
    if (typeof val === "string") return Number(val);
    return val;
  }, z.number().min(1, "Amount must be greater than 0")),
  income_particular: z.number().min(1, "Income particular is required"),
  received_from: z.number().min(1, "Received from is required"),
  adjust_from_balance: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PaymentForm() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [incomeParticulars, setIncomeParticulars] = useState<any[]>([]);
  const [receivedFromList, setReceivedFromList] = useState<any[]>([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adjust_from_balance: false,
    },
  });

  // Fetch options data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, paymentRes, incomeRes, receivedRes] =
          await Promise.all([
            axiosInstance.get(
              "/api/member_financial/v1/invoices/?fields=id,invoice_number"
            ),
            axiosInstance.get(
              "/api/member_financial/v1/payment/options/?fields=id,name"
            ),
            axiosInstance.get(
              "/api/member_financial/v1/income/particular/?fields=id,name"
            ),
            axiosInstance.get(
              "/api/member_financial/v1/income/receiving_options/?fields=id,name"
            ),
          ]);

        setInvoices(invoiceRes.data.data);
        setPaymentMethods(paymentRes.data.data);
        setIncomeParticulars(incomeRes.data.data);
        setReceivedFromList(receivedRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load form data.");
      }
    };
    fetchData();
  }, []);

  // Mutation to submit form
  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      axiosInstance.post("/api/member_financial/v1/payment/invoice/", data),
    onSuccess: () => {
      toast.success("Payment submitted successfully!");
      router.refresh();
      form.reset();
    },
    onError: (error: any) => {
      const errors = error?.response?.data?.errors;
      if (errors) {
        const firstKey = Object.keys(errors)[0];
        const firstMessage = errors[firstKey][0];
        console.error("Validation errors:", errors);
        toast.error(firstMessage);
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to submit payment."
        );
      }
    },
  });

  const onSubmit = (values: FormValues) => {
    const payload = {
      ...values,
      amount: Number(values.amount),
    };
    mutation.mutate(payload);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto p-4 border rounded-lg shadow"
      >
        {/* Invoice with search */}
        <FormField
          control={form.control}
          name="invoice_id"
          render={({ field }) => {
            const [search, setSearch] = useState("");
            const filteredInvoices = invoices.filter((inv) =>
              inv.invoice_number.toLowerCase().includes(search.toLowerCase())
            );

            return (
              <FormItem>
                <FormLabel>Invoice</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={String(field.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Invoice" />
                  </SelectTrigger>

                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Search invoice..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {filteredInvoices.map((inv) => (
                      <SelectItem key={inv.id} value={String(inv.id)}>
                        {inv.invoice_number}
                      </SelectItem>
                    ))}
                    {filteredInvoices.length === 0 && (
                      <div className="p-2 text-gray-500">No invoice found</div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Payment Method */}
        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={String(field.value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((pm) => (
                    <SelectItem key={pm.id} value={String(pm.id)}>
                      {pm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  value={
                    field.value === undefined || field.value === null
                      ? ""
                      : String(field.value)
                  }
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Income Particular */}
        <FormField
          control={form.control}
          name="income_particular"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Income Particular</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={String(field.value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Income Particular" />
                </SelectTrigger>
                <SelectContent>
                  {incomeParticulars.map((ip) => (
                    <SelectItem key={ip.id} value={String(ip.id)}>
                      {ip.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Received From */}
        <FormField
          control={form.control}
          name="received_from"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Received From</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={String(field.value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent>
                  {receivedFromList.map((rf) => (
                    <SelectItem key={rf.id} value={String(rf.id)}>
                      {rf.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Adjust From Balance */}
        <FormField
          control={form.control}
          name="adjust_from_balance"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel>Adjust from Balance</FormLabel>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit Payment"}
        </Button>
      </form>
    </Form>
  );
}
