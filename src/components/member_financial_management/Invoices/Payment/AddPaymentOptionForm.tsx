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
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, { message: "Max 255 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddPaymentOption({ open, onClose }: Props) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { setError } = form;

  const { mutate: addPaymentOption, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      return await axiosInstance.post(
        "/api/member_financial/v1/payment/options/",
        data
      );
    },
    onSuccess: (res) => {
      toast.success(res.data.message || "Payment option added successfully", {
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
    addPaymentOption(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payment Option</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Option Name :</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter payment option name" {...field} />
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
                {isPending ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
