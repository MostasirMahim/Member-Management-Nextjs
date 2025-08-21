"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  data: any;
  due_id: any;
}

export default function PayDueForm({ data, due_id }: Props) {
  const form = useForm({
    defaultValues: {
      payment_method: "",
      amount: 0,
      adjust_from_balance: false,
      reset: "",
      submit: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: any) {
    try {
      const response = await axiosInstance.post(
        "/api/member_financial/v1/member_dues/",
        {
          ...values,
          member_due_id: due_id,
        }
      );
      if (response.status === 200) {
        toast.success("Due paid successfully!");
        router.push(`/mfm/view_member_dues/${due_id}`);
        router.refresh();
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        // Field specific errors
        for (const key in errors) {
          if (key !== "non_field_errors") {
            form.setError(key as any, {
              type: "server",
              message: errors[key][0],
            });
          }
        }

        // Non-field errors (e.g. general form errors)
        if (errors.non_field_errors) {
          form.setError("root", {
            type: "server",
            message: errors.non_field_errors.join(" "),
          });
        }
      }
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={onReset}
        className="space-y-8 @container"
      >
        <FormMessage />
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={form.control}
            name="payment_method"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Payment method</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Select
                      key="select-0"
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.map((op: any) => (
                          <SelectItem key={`${op.id}`} value={`${op.id}`}>
                            {op.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select payment method to pay with
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Amount</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="number-input-0"
                        placeholder="Enter amount"
                        type="number"
                        id="amount"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <DollarSign className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter amount you want to pay
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adjust_from_balance"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="hidden shrink-0">
                  Adjust from balance
                </FormLabel>

                <div className="w-full">
                  <FormControl>
                    <FormLabel
                      key="checkbox-0"
                      className="border-0 p-0 w-full flex items-start has-[[data-state=checked]]:border-primary"
                      htmlFor="adjust_from_balance"
                    >
                      <Checkbox
                        id="adjust_from_balance"
                        className=""
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <FormLabel>Adjust from balance</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Adjust from member balance
                        </p>
                      </div>
                    </FormLabel>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reset"
            render={({ field }) => (
              <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="hidden shrink-0">Reset</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Button
                      key="reset-button-0"
                      id="reset"
                      name=""
                      className="w-full"
                      type="reset"
                      variant="outline"
                    >
                      Reset
                    </Button>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="submit"
            render={({ field }) => (
              <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="hidden shrink-0">Submit</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Button
                      key="submit-button-0"
                      id="submit"
                      name=""
                      className="w-full"
                      type="submit"
                      variant="default"
                    >
                      Submit
                    </Button>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
