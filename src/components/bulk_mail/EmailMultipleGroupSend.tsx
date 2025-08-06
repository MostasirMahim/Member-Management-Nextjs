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
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import React from "react";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

interface Props {
  data: any;
  composeId: string;
}

function EmailMultipleGroupSend({ data, composeId }: Props) {
  const groups = data?.data;
  const form = useForm();

  async function onSubmit(values: object) {
    const selectedGroupIds = Object.entries(values)
      .filter(([key, value]) => key.startsWith("group-") && value === true)
      .map(([key]) => Number(key.replace("group-", "")));
    const axiosRequests = [];
    for (const groupId of selectedGroupIds) {
      const axiosObj = axiosInstance.post("/api/mails/v1/emails/send/", {
        group: groupId,
        email_compose: composeId,
      });
      axiosRequests.push(axiosObj);
    }
    try {
      const results = await Promise.allSettled(axiosRequests);
      console.log(results);

      const success = results.filter((res) => res.status === "fulfilled");
      const failed = results.filter((res) => res.status === "rejected");
      toast.success(
        `${success.length} requests have been made to send emails!`
      );

      if (failed.length > 0) {
        toast.warn(`${failed.length} requests failed!}`);
      } else {
        form.reset();
        form.clearErrors();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }
  return (
    <div className="shadow-md rounded-md p-4 border">
      <div className=" mb-4">
        <h4 className="text-center font-bold text-3xl">Send email</h4>
        <p className="text-center">
          Send email of this compose to multiple groups
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="space-y-8 @container"
        >
          <div className="grid grid-cols-12 gap-4">
            {groups?.map((group: any) => (
              <FormField
                key={group.id}
                control={form.control}
                name={`group-${group.id}`}
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="hidden shrink-0">
                      {group.name}
                    </FormLabel>

                    <div className="w-full">
                      <FormControl>
                        <FormLabel
                          key="checkbox-0"
                          className="border-0 p-0 w-full flex items-start has-[[data-state=checked]]:border-primary"
                          htmlFor={`group-${group.id}`}
                        >
                          <Checkbox
                            id={`group-${group.id}`}
                            className=""
                            {...field}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <FormLabel>{group.name}</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              {group.description}
                            </p>
                          </div>
                        </FormLabel>
                      </FormControl>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            ))}

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
              name="submit-button-1"
              render={({ field }) => (
                <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="hidden shrink-0">Submit</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <Button
                        key="submit-button-1"
                        id="submit-button-1"
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

export default EmailMultipleGroupSend;
