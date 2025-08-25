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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FileChartColumnIncreasing } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

interface Props {
  incomeParticular: any;
  receivedFrom: any;
}

export default function LoungeUploadForm({
  incomeParticular,
  receivedFrom,
}: Props) {
  const form = useForm({
    defaultValues: {
      excel_file: "",
      income_particular: "",
      received_from: "",
      confirm_reupload: false,
      "submit-button-0": "",
    },
  });
  const incomeParticularOptions = incomeParticular?.data;
  const receivedFromOptions = receivedFrom?.data;

  async function onSubmit(values: any) {
    const formData = new FormData();
    formData.append("income_particular", values.income_particular);
    formData.append("received_from", values.received_from);
    formData.append("confirm_reupload", values.confirm_reupload);

    if (values.excel_file?.[0]) {
      formData.append("excel_file", values.excel_file[0]);
    }
    try {
      const response = await axiosInstance.post(
        "/api/member_financial/v1/lounge/upload/excel/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Lounge sales uploaded successfully!");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
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
            name="excel_file"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">File upload</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="file-input-0"
                        placeholder="Select file"
                        type="file"
                        id="excel_file"
                        className=" ps-9"
                        name={field.name}
                        onChange={(e) => {
                          field.onChange(e.target.files);
                        }}
                        ref={field.ref}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <FileChartColumnIncreasing
                          className="size-4"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload lounge sale excel file
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
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
                      key="select-0"
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
                  <FormDescription>Select income particular</FormDescription>
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
                      key="select-1"
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="select received from option" />
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
                  <FormDescription>select received from option</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_reupload"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="hidden shrink-0">
                  Confirm reupload
                </FormLabel>

                <div className="w-full">
                  <FormControl>
                    <FormLabel
                      key="checkbox-0"
                      className="border-0 p-0 w-full flex items-start has-[[data-state=checked]]:border-primary"
                      htmlFor="confirm_reupload"
                    >
                      <Checkbox
                        id="confirm_reupload"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <FormLabel>Confirm reupload</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Mark as reupload
                        </p>
                      </div>
                    </FormLabel>
                  </FormControl>
                  <FormDescription>
                    Are you reuploading the file?
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="submit-button-0"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
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
