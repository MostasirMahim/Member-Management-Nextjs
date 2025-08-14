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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.coerce.number().min(1, "Select a category"),
  quantity_in_stock: z.coerce.number().min(0, "Quantity is required"),
  brand: z.coerce.number().optional().or(z.literal(NaN)),
  discount_rate: z.coerce.number().min(0, "Discount rate is required"),
});

export default function AddProductForm() {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      sku: "",
      category: 0,
      quantity_in_stock: 0,
      brand: 0,
      discount_rate: 0,
    },
  });

  const router = useRouter();
  const { reset, setError } = form;

  // Load category & brand data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axiosInstance.get("/api/product/v1/products/categories/"),
          axiosInstance.get("/api/product/v1/products/brands/"),
        ]);
        setCategories(catRes.data.data || []);
        setBrands(brandRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch category/brand data", error);
      }
    };
    fetchData();
  }, []);

  const { mutate: addProduct, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await axiosInstance.post(
        "/api/product/v1/products/",
        values
      );
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 200 || response.status === 201) {
        toast.success(" Product added successfully!", {
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
          setError(key as keyof z.infer<typeof formSchema>, {
            type: "server",
            message: errors[key][0],
          });
        }
        toast.error("" + error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error(" Unexpected error occurred", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = { ...values };
    if (!payload.brand || Number.isNaN(payload.brand)) {
      delete payload.brand;
    }
    addProduct(payload);
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 px-4 py-5 bg-opacity-0">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-center md:text-2xl font-bold mb-6 text-gray-800">
          Add Product
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={() => reset()}
            className="space-y-6"
          >
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter SKU" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Select */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Brand Select */}
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand (optional)</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value ? Number(value) : undefined)
                      }
                      value={field.value?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((b) => (
                          <SelectItem key={b.id} value={b.id.toString()}>
                            {b.name}
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
              name="quantity_in_stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="reset">
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
