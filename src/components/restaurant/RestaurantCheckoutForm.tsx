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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useForm } from "react-hook-form";

import { Percent } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "../ui/button";
import { useRestaurantCartStore } from "@/store/restaurantStore";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

interface Props {
  memberData: any;
  promoCodeData: any;
}

interface PaginationProps {
  data: any;
}

function PaginationForItems({ data }: PaginationProps) {
  const paginationData = data;
  const router = useRouter();
  const currentPage = paginationData?.current_page || 1;
  const totalPages = paginationData?.total_pages || 1;

  const goToPage = (page: number) => {
    if (page !== currentPage) {
      router.push(`?page=${page}`);
      router.refresh();
    }
  };

  const renderPageLinks = () => {
    const pagesToShow = [];

    for (let i = 1; i <= totalPages; i++) {
      pagesToShow.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => goToPage(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pagesToShow;
  };
  return (
    <div>
      <div className="my-5 pb-11">
        {/* -- PAGINATION -- */}
        <div className=" flex justify-center">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              {paginationData?.previous && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage - 1);
                    }}
                  />
                </PaginationItem>
              )}

              {/* Page Numbers */}
              {renderPageLinks()}

              {/* Next Button */}
              {paginationData?.next && (
                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

function RestaurantCheckoutForm({ memberData, promoCodeData }: Props) {
  const form = useForm({
    defaultValues: {
      member_ID: "",
      promo_code: "",
      "reset-button-0": "",
      "submit-button-0": "",
    },
  });
  const { setError } = form;

  const cart = useRestaurantCartStore((state) => state.cart);
  const restaurant = useRestaurantCartStore((state) => state.restaurant);
  const members = memberData.data;
  const promoCodes = promoCodeData.data;
  const paginationData = memberData.pagination;

  async function onSubmit(values: any) {
    try {
      const requestData: any = {
        restaurant_items: cart,
        restaurant: restaurant,
        member_ID: values.member_ID,
      };
      if (values.promo_code !== "") {
        requestData.promo_code = values.promo_code;
      }
      const response = await axiosInstance.post(
        "/api/restaurants/v1/restaurants/items/buy/",
        requestData
      );
      if (response.status === 201) {
        toast.success("Invoice created successfully");
      }
    } catch (error: any) {
      console.log(error);
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
    <div>
      <div className="my-4">
        <div>
          <h2 className="font-bold">Selected Items</h2>
        </div>
        {cart.map((item: any) => (
          <h4 className="">
            Name: {item.name} &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
            Quantity: {item.quantity} &nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp; price: &nbsp;$
            {item.selling_price * item.quantity}
          </h4>
        ))}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="space-y-8 @container"
        >
          <div className="grid grid-cols-12 gap-4">
            <FormField
              control={form.control}
              name="member_ID"
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Select member</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <Select
                        key="select-0"
                        {...field}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full ">
                          <SelectValue placeholder="Select member id" />
                        </SelectTrigger>
                        <SelectContent>
                          {members.map((member: any) => (
                            <SelectItem
                              key={member.id}
                              value={member.member_ID}
                            >
                              {member.member_ID}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the member id for whom you want to buy the items
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="col-span-12 col-start-auto flex self-end flex-col gap-2  items-start">
              <PaginationForItems data={paginationData} />
            </div>
            <FormField
              control={form.control}
              name="promo_code"
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Promo code</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="text-input-0"
                          placeholder="Enter promo code"
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
                          <Percent className="size-4" strokeWidth={2} />
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter any promo codes if you have
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
    </div>
  );
}

export default RestaurantCheckoutForm;
