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
  image: FileList;
};

export default function AddMediaPage() {
  const [products, setProducts] = useState<any[]>([]);
  const form = useForm<FormValues>({});
  const router = useRouter();
  const { reset, setError } = form;

  // Load product data for select
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

  const { mutate: addMedia, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const formData = new FormData();
      formData.append("product", values.product.toString());
      formData.append("image", values.image[0]);

      const response = await axiosInstance.post(
        "/api/product/v1/products/media/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    },
    onSuccess: () => {
      toast.success("Media added successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
      reset();
      router.refresh();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Unexpected error occurred";
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!values.product) {
      setError("product", { type: "manual", message: "Product is required" });
      return;
    }
    if (!values.image || values.image.length === 0) {
      setError("image", { type: "manual", message: "Image is required" });
      return;
    }
    addMedia(values);
  };

  return (
    <div className="flex justify-center items-center px-4 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-lg transition-colors duration-300">
        <h2 className="text-center md:text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Add Media
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
                      <SelectTrigger className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
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

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-200">
                    Upload Image
                  </FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                      className="block w-full text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                type="reset"
                onClick={() => reset()}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
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
