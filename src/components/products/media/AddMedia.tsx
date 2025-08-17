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
  const form = useForm<FormValues>({
    
  });
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
  console.log("Products:", products);
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
    onSuccess: (response) => {
      toast.success("Media added successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
      reset();
      router.refresh();
    },
    onError: (error: any) => {
      if (error?.response?.data?.message) {
        toast.error("" + error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("Unexpected error occurred", {
          position: "top-center",
          autoClose: 3000,
        });
      }
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
    <div className="flex justify-center items-center px-4 py-5">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-center md:text-2xl font-bold mb-6 text-gray-800">
          Add Media
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
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

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
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
                onClick={() => reset()}
              >
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
