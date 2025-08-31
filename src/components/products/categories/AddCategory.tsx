"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "This field is required" })
    .max(255, { message: "Must be at most 255 characters" }),
});

export default function AddCategory() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const router = useRouter();
  const { reset, setError } = form;

  const { mutate: addCategory, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await axiosInstance.post(
        "/api/product/v1/products/categories/",
        values
      );
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success(" " + response.data.message, {
          position: "top-center",
          autoClose: 3000,
        });
        reset();
        router.refresh();
      } else {
        toast.warning(" Something went wrong", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    },
    onError: (error: any) => {
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        for (const key in errors) {
          setError(key as "name", {
            type: "server",
            message: errors[key][0],
          });
          console.error("Server error:", errors[key][0]);
        }
        toast.error("" + error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        console.error("Unhandled error:", error);
        toast.error(" Unexpected error occurred", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addCategory(values);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-16">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-lg transition-colors duration-300">
        <h2 className="text-center md:text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Add Product Category
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={() => form.reset()}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-gray-700 dark:text-gray-300">
                    Category Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
                      type="text"
                      id="name"
                      {...field}
                      className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                type="reset"
                className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
