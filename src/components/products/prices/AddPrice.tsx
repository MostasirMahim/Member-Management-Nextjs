"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

type FormValues = {
  product: number;
  membership_type: string;
  price: number;
};

export default function AddProductPrice() {
  const [products, setProducts] = useState<any[]>([]);
  const [membershipTypes, setMembershipTypes] = useState<any[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {},
  });

  const router = useRouter();
  const { reset, setError } = form;

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/api/product/v1/products/");
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  // Load membership types
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const res = await axiosInstance.get("/api/core/v1/membership_type/");
        setMembershipTypes(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch membership types", err);
      }
    };
    fetchMemberships();
  }, []);

  const { mutate: addPrice, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await axiosInstance.post(
        "/api/product/v1/products/prices/",
        values
      );
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.data.message || "Price added successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
      reset();
      router.refresh();
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        const resData = error.response.data;
        if (resData.errors) {
          const messages = Object.values(resData.errors).flat().join("\n");
          toast.error(messages, {
            position: "top-center",
            autoClose: 5000,
          });
        } else if (resData.message) {
          toast.error(resData.message, {
            position: "top-center",
            autoClose: 5000,
          });
        } else {
          toast.error("Unexpected error occurred", {
            position: "top-center",
            autoClose: 5000,
          });
        }
      } else {
        toast.error("Unexpected error occurred", {
          position: "top-center",
          autoClose: 5000,
        });
      }
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!values.product) {
      setError("product", { type: "manual", message: "Product is required" });
      return;
    }
    if (!values.membership_type) {
      setError("membership_type", {
        type: "manual",
        message: "Membership type is required",
      });
      return;
    }
    if (!values.price || values.price <= 0) {
      setError("price", {
        type: "manual",
        message: "Price must be greater than 0",
      });
      return;
    }
    addPrice(values);
  };

  return (
    <div className="flex justify-center items-center px-4 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-lg transition-colors duration-300">
        <h2 className="text-center text-gray-800 dark:text-gray-100 md:text-2xl font-bold mb-6">
          Add Product Price
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Select */}
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-200">
                    Select Product
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString() || ""}
                    >
                      <SelectTrigger className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Membership Type */}
            <FormField
              control={form.control}
              name="membership_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-200">
                    Membership Type
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value?.toString() || undefined}
                    >
                      <SelectTrigger className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Select membership type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                        {membershipTypes.map((m) => (
                          <SelectItem key={m.id} value={m.name.toString()}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Price Input */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-200">
                    Price
                  </FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Enter price"
                      {...field}
                      className="w-full px-3 py-2 border rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                type="reset"
                onClick={() => reset()}
                className="border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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
