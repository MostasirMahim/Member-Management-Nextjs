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
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ALargeSmall, SquaresUnite, DollarSign } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

interface Props {
  restaurantData: any;
  categoriesData: any;
}

function RestaurantItemAddForm({ restaurantData, categoriesData }: Props) {
  const restaurants = restaurantData?.data;
  const categories = categoriesData?.data;

  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      availability: false,
      unit: "",
      unit_cost: 0,
      selling_price: 0,
      category: "",
      restaurant: "",
      "reset-button-0": "",
      "submit-button-0": "",
    },
  });
  const { setError } = form;

  async function onSubmit(values: any) {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/api/restaurants/v1/restaurants/items/",
        values
      );
      if (response.status === 201) {
        toast.success("Item added successfully");
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
    } finally {
      setLoading(false);
    }
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
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
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Item name</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-0"
                        placeholder="Franch fry"
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
                  <FormDescription>Enter item name</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Description</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Textarea
                      key="textarea-0"
                      id="description"
                      placeholder="Made in franch"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter item description</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="hidden shrink-0">Availability</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <FormLabel
                      key="switch-0"
                      className="border-0 p-0 w-full flex justify-between items-center has-[[data-state=checked]]:border-primary"
                      htmlFor="availability"
                    >
                      <div className="grid gap-1.5 leading-none">
                        <FormLabel>Availability</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Item availability
                        </p>
                      </div>
                      <Switch
                        id="availability"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormLabel>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Unit</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-1"
                        placeholder="1kg"
                        type="text"
                        id="unit"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <SquaresUnite className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Enter item unit</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit_cost"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Unit cost</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="number-input-0"
                        placeholder="599"
                        type="number"
                        id="unit_cost"
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
                  <FormDescription>
                    Enter unit price that is need to make the item
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="selling_price"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Selling price</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="number-input-1"
                        placeholder=""
                        type="number"
                        id="selling_price"
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
                  <FormDescription>Enter selling price</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Category</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Select
                      key="select-0"
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Item category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category: any) => (
                          <SelectItem
                            key={category.id}
                            value={`${category.id}`}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Select item category</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="restaurant"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Restaurant</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Select
                      key="select-1"
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Restaurant" />
                      </SelectTrigger>
                      <SelectContent>
                        {restaurants?.map((restaurant: any) => (
                          <SelectItem
                            key={restaurant.id}
                            value={`${restaurant.id}`}
                          >
                            {restaurant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Select restaurant</FormDescription>
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
                      disabled={loading}
                    >
                      {loading ? "loading..." : "Submit"}
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
  );
}

export default RestaurantItemAddForm;
