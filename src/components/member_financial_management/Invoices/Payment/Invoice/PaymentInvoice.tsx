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

// Validation schema
const formSchema = z.object({
  invoice_id: z.number(),
  payment_method: z.number(),
  amount: z.number().min(1, "Amount must be greater than 0"),
  income_particular: z.number(),
  received_from: z.number(),
  adjust_from_balance: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PaymentForm() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [incomeParticulars, setIncomeParticulars] = useState<any[]>([]);
  const [receivedFromList, setReceivedFromList] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_id: 0,
      payment_method: 0,
      amount: 0,
      income_particular: 0,
      received_from: 0,
      adjust_from_balance: false,
    },
  });

  // Fetch options data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, paymentRes, incomeRes, receivedRes] =
          await Promise.all([
            axiosInstance.get("/api/member_financial/v1/invoices/"),
            axiosInstance.get("/api/member_financial/v1/payment/options/"),
            axiosInstance.get("/api/member_financial/v1/income/particular/"),
            axiosInstance.get(
              "/api/member_financial/v1/income/receiving_options/"
            ),
          ]);
        setInvoices(invoiceRes.data);
        setPaymentMethods(paymentRes.data);
        setIncomeParticulars(incomeRes.data);
        setReceivedFromList(receivedRes.data);
        console.log(invoiceRes.data, "Invoices");
        console.log(paymentRes.data, "Payment Methods");
        console.log(incomeRes.data, "Income Particulars");
        console.log(receivedRes.data, "Received From");
        
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
      toast.error(error?.response?.data?.message || "Failed to submit payment.");
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-4 border rounded-lg shadow">
        {/* Invoice */}
        <FormField
          control={form.control}
          name="invoice_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice</FormLabel>
              <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Invoice" />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((inv) => (
                    <SelectItem key={inv.id} value={String(inv.id)}>
                      {inv.name || `Invoice #${inv.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Method */}
        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)}>
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
                <Input type="number" {...field} />
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
              <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)}>
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
              <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)}>
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
                <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Submitting..." : "Submit Payment"}
        </Button>
      </form>
    </Form>
  );
}
