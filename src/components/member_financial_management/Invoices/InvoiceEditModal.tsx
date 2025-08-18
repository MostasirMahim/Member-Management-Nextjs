"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// ✅ Zod Schema
const formSchema = z.object({
  balance_due: z.string().min(1, "Balance due is required"),
  paid_amount: z.string().min(1, "Paid amount is required"),
  total_amount: z.string().min(1, "Total amount is required"),
  payment_method: z.string().min(1, "Payment method is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  invoice: {
    id: number;
    total_amount: string;
    paid_amount: string;
    balance_due: string;
  };
}

export default function EditInvoiceModal({ open, onClose, invoice }: Props) {
  const router = useRouter();

  // ✅ Fetch Payment Methods
  const { data: paymentOptions, isLoading: loadingPayments } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/api/member_financial/v1/payment/options/"
      );
      return res.data.data; // [{id, name}, ...]
    },
  });

  // ✅ React Hook Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      balance_due: invoice.balance_due,
      paid_amount: invoice.paid_amount,
      total_amount: invoice.total_amount,
      payment_method: "",
    },
  });

  const { setError } = form;

  // Mutation for updating invoice
  const { mutate: updateInvoice, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      return await axiosInstance.patch(
        `/api/member_financial/v1/invoices/${invoice.id}/`,
        data
      );
    },
    onSuccess: (res) => {
      toast.success(res.data.message || "Invoice updated successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      onClose();
      router.refresh();
    },
    onError: (error: any) => {
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        for (const key in errors) {
          setError(key as keyof FormValues, {
            type: "server",
            message: errors[key][0],
          });
        }
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("Unexpected error occurred", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    updateInvoice(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Total Amount */}
            <FormField
              control={form.control}
              name="total_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Paid Amount */}
            <FormField
              control={form.control}
              name="paid_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paid Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Balance Due */}
            <FormField
              control={form.control}
              name="balance_due"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance Due</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingPayments ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : (
                          paymentOptions?.map((method: any) => (
                            <SelectItem key={method.id} value={String(method.id)}>
                              {method.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
