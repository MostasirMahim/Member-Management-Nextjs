"use client";

import { useSearchParams } from "next/navigation";
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
import { ALargeSmall } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";

function AddChoiceForRestaurant() {
  const searchParams = useSearchParams();
  const state = searchParams.get("state");
  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: any) {
    // if (state == "category") {
    //   const response = await axiosInstance.post();
    // }
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <div>
      <div>
        <h4 className="text-center font-bold">Add choice of {state}</h4>
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
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Name</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="text-input-0"
                          placeholder="Name"
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
                    <FormDescription>Enter name of the choice</FormDescription>
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
    </div>
  );
}

export default AddChoiceForRestaurant;
