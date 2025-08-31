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
import {
  ALargeSmall,
  DollarSign,
  TowerControl,
  Timer,
  Box,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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

export default function GeneratedForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      usages_fee: 0,
      usages_roles: "",
      operating_hours: "",
      status: "option1",
      capacity: 0,
      "reset-button-0": "",
      "submit-button-0": "",
    },
  });
  const { setError } = form;

  async function onSubmit(values: any) {
    try {
      const response = await axiosInstance.post(
        "/api/facility/v1/facilities/",
        values
      );
      if (response.status == 200) {
        toast.success("Facility added successfully");
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
    <div>
      <div>
        <h4 className="text-xl font-semibold text-center">Add Facility</h4>
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
              name="name"
              rules={{
                required: "Facility name is required",
              }}
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Facility Name</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="text-input-0"
                          placeholder="eg: Gym"
                          type="text"
                          id="name"
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
                    <FormDescription>Enter facility name</FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              rules={{
                required: "Facility description is required",
              }}
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Description</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <Textarea
                        key="textarea-0"
                        id="description"
                        placeholder="Gym has everything to keep you fit"
                        className=""
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Write description about gym
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usages_fee"
              rules={{
                required: "Facility usages_fee is required",
              }}
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Usages fee</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="number-input-0"
                          placeholder=""
                          type="number"
                          id="usages_fee"
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
                    <FormDescription>Enter usages fee</FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usages_roles"
              rules={{
                required: "Facility usages_roles is required",
              }}
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Usages roles</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="usages_roles"
                          placeholder="eg: member"
                          type="text"
                          id="usages_roles"
                          className=" ps-9"
                          {...field}
                        />
                        <div
                          className={
                            "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                          }
                        >
                          <TowerControl className="size-4" strokeWidth={2} />
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>Enter usages roles</FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="operating_hours"
              rules={{
                required: "Facility operating_hours is required",
              }}
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">
                    Operating hours
                  </FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="text-input-2"
                          placeholder="eg: 6 AM - 9 PM"
                          type="text"
                          id="operating_hours"
                          className=" ps-9"
                          {...field}
                        />
                        <div
                          className={
                            "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                          }
                        >
                          <Timer className="size-4" strokeWidth={2} />
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>Enter operating hours</FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              rules={{
                required: "Facility status is required",
              }}
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Select</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <Select
                        key="select-0"
                        {...field}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full ">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key="open" value="open">
                            open
                          </SelectItem>

                          <SelectItem key="close" value="close">
                            close
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select status open or close
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              rules={{
                required: "Facility capacity is required",
              }}
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Capacity</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="number-input-1"
                          placeholder=""
                          type="number"
                          id="capacity"
                          className=" ps-9"
                          {...field}
                        />
                        <div
                          className={
                            "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                          }
                        >
                          <Box className="size-4" strokeWidth={2} />
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the capacity of facility
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
