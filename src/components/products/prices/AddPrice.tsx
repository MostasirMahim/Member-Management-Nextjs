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
      console.log("Submitting values:", values);
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

        // Validation errors
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
    console.log("Submitting price:", values);
    addPrice(values);
  };

  return (
    <div className="flex justify-center items-center px-4 py-5">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-center md:text-2xl font-bold mb-6 text-gray-800">
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
                  <FormLabel>Select Product</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="membership_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membership Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value?.toString() || undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select membership type" />
                      </SelectTrigger>
                      <SelectContent>
                        {membershipTypes.map((m) => (
                          <SelectItem key={m.id} value={m.name.toString()}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Input */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Enter price"
                      {...field}
                      className="w-full border rounded px-3 py-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="reset" onClick={() => reset()}>
                Reset
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
