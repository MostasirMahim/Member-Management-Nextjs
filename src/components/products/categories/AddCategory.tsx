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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";

interface Props {
  categories: { id: number; name: string }[];
}

export default function AddProductForm({ categories }: Props) {
  const form = useForm<{ name: string; category: string }>({});
  const { setError, reset } = form;
  const router = useRouter();

  const onSubmit = async (values: { name: string; category: string }) => {
    try {
      const response = await axiosInstance.post(
        "/api/product/v1/products/",
        values
      );
      if (response.status === 201) {
        alert("Product added");
        reset();
        router.refresh(); // Optional: reload data
      } else {
        alert("Something went wrong");
      }
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        for (const key in errors) {
          setError(key as "name" | "category", {
            type: "server",
            message: errors[key][0],
          });
        }
      } else {
        console.error("Error:", error);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-xl mx-auto py-10"
      >
        {/* Name input */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
