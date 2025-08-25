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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ALargeSmall, SquaresUnite, DollarSign, Sheet } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";

interface Props {
  incomeParticular: any;
  receivedFrom: any;
  restaurant: any;
}

export default function RestaurantSalesUploadForm({
  incomeParticular,
  receivedFrom,
  restaurant,
}: Props) {
  const form = useForm({
    defaultValues: {
      excel_file: "",
      restaurant: "",
      income_particular: "",
      received_from: "",
      "reset-button-0": "",
      "submit-button-0": "",
    },
  });
  const router = useRouter();

  function onSubmit(values: any) {
    console.log(values);
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }
  const incomeParticularOptions = incomeParticular?.data;
  const receivedFromOptions = receivedFrom?.data;
  const restaurantOptions = restaurant?.data;
  const paginationData = restaurant.pagination;

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={onReset}
        className="space-y-8 @container"
      >
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={form.control}
            name="excel_file"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">File upload</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="file-input-0"
                        placeholder=""
                        type="file"
                        id="excel_file"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <Sheet className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload restaurant sales excel file
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="restaurant"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Restaurant</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Select
                      key="select-0"
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Select restaurant " />
                      </SelectTrigger>
                      <SelectContent>
                        {restaurantOptions?.map((item: any) => (
                          <SelectItem key={item.id} value={`${item.id}`}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Select the restaurant</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="pb-5">
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
          <FormField
            control={form.control}
            name="income_particular"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">
                  Income particular
                </FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Select
                      key="select-1"
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Select income particular" />
                      </SelectTrigger>
                      <SelectContent>
                        {incomeParticularOptions?.map((item: any) => (
                          <SelectItem key={item.id} value={`${item.id}`}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the income particular
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="received_from"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Received from</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Select
                      key="select-2"
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Select received from option" />
                      </SelectTrigger>
                      <SelectContent>
                        {receivedFromOptions?.map((item: any) => (
                          <SelectItem key={item.id} value={`${item.id}`}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Select received from option</FormDescription>
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
