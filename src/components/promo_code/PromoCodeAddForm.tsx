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
import { Input } from "@/components/ui/input";
import {
  ALargeSmall,
  CalendarIcon,
  Percent,
  CircleEllipsis,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

interface Props {
  categories: any;
}

interface CatType {
  id: number;
  name: string;
}

const formatDateLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function PromoCodeAddForm({ categories }: Props) {
  const allCategories = categories.data;
  const form = useForm({
    defaultValues: {
      promo_code: "",
      start_date: "",
      end_date: "",
      percentage: 0,
      limit: 0,
      description: "",
      amount: 0,
      category: [],
      "submit-button-0": "",
      "reset-button-0": "",
    },
  });
  const { setError } = form;

  async function onSubmit(values: any) {
    const percentage = parseInt(values.percentage);
    const amount = parseInt(values.amount);
    if (percentage != 0 && amount != 0) {
      setError("percentage", {
        type: "server",
        message: "Percentage and amount can't present together.",
      });
      setError("amount", {
        type: "server",
        message: "Percentage and amount can't present together.",
      });
      return;
    } else if (percentage == 0 && amount == 0) {
      setError("percentage", {
        type: "server",
        message: "Percentage or amount one must exist.",
      });
      setError("amount", {
        type: "server",
        message: "Percentage or amount one must exist.",
      });
      return;
    }
    if (percentage != 0) {
      delete values["amount"];
    } else {
      delete values["percentage"];
    }

    if (values.start_date instanceof Date) {
      values.start_date = formatDateLocal(values.start_date);
    }

    if (values.end_date instanceof Date) {
      values.end_date = formatDateLocal(values.end_date);
    }
    try {
      const response = await axiosInstance.post(
        "/api/promo_code/v1/promo_codes/",
        values
      );
      if (response.status == 200) {
        toast.success("Promo code added successfully");
        form.reset();
        form.clearErrors();
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        // Field specific errors
        for (const key in errors) {
          if (key !== "non_field_errors") {
            setError(key as any, {
              type: "server",
              message: errors[key][0],
            });
          }
        }

        // Non-field errors (e.g. general form errors)
        if (errors.non_field_errors) {
          setError("root", {
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
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={form.control}
            name="promo_code"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Promo code</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-0"
                        placeholder="eg: OFF30"
                        type="text"
                        id="promo_code"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <ALargeSmall className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Enter your promo code</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_date"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Start date</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="justify-start text-left font-normal w-full"
                          id="start_date"
                          name="start_date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-muted-foreground">
                              Pick a date
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>Enter promo code start date</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">End date</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="justify-start text-left font-normal w-full"
                          id="end_date"
                          name="end_date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-muted-foreground">
                              End date
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>Enter promo code end date</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="percentage"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">
                  Percentage to discount
                </FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-1"
                        placeholder="Percentage "
                        type="text"
                        id="percentage"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <Percent className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter a percentage to discount
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="limit"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Limit</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="number-input-0"
                        placeholder="100"
                        type="number"
                        id="limit"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <CircleEllipsis className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter how many time this promo code can be used
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Description</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Textarea
                      key="textarea-0"
                      id="description"
                      placeholder="Will be used in eid"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write description of this promo code
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Amount</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="number-input-1"
                        placeholder="100"
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
                        <ALargeSmall className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter how much amount you want to give discount
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 flex flex-col gap-2">
                <FormLabel>Promo code category</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="grid w-full gap-2">
                      {allCategories?.map((cat: CatType) => (
                        <FormItem
                          key={cat.id}
                          className="rounded-md border p-4 space-x-2 flex items-start"
                        >
                          <FormControl>
                            <Checkbox
                              checked={(field.value as number[]).includes(
                                cat.id
                              )}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([
                                    ...(field.value || []),
                                    cat.id,
                                  ]);
                                } else {
                                  field.onChange(
                                    field.value?.filter(
                                      (value: number) => value !== cat.id
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <div className="grid gap-2 leading-none">
                            <FormLabel className="font-medium">
                              {cat.name}
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Category ID: {cat.id}
                            </p>
                          </div>
                        </FormItem>
                      ))}
                    </div>
                  </FormControl>

                  <FormDescription>
                    Select one or more promo code categories.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reset-button-0"
            render={({ field }) => (
              <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="hidden shrink-0">Reset</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Button
                      key="reset-button-0"
                      id="reset-button-0"
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
            name="submit-button-0"
            render={({ field }) => (
              <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="hidden shrink-0">Submit</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Button
                      key="submit-button-0"
                      id="submit-button-0"
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
