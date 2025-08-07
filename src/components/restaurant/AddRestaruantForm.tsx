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
import {
  ALargeSmall,
  LocationEdit,
  TowerControl,
  LocateFixed,
  Signpost,
  PhoneCall,
  AlarmClock,
  Shuffle,
  LockKeyholeOpen,
  CircleDollarSign,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  cuisinesData: any;
  categoriesData: any;
}

export default function AddRestaurantForm({
  cuisinesData,
  categoriesData,
}: Props) {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      phone: "",
      operating_hours: "",
      capacity: "",
      status: "",
      opening_time: "",
      closing_time: "",
      booking_fees_per_seat: "",
      cuisine_type: "",
      restaurant_type: "",
    },
  });

  const cuisines = cuisinesData?.data;
  const categories = categoriesData?.data;

  function onSubmit(values: any) {
    console.log(values);
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
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Name</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-0"
                        placeholder="KFC"
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
                  <FormDescription>Enter restaurant name</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Description </FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Textarea
                      key="textarea-0"
                      id="description"
                      placeholder=""
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter restaurant description
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Address</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-1"
                        placeholder="Dhaka"
                        type="text"
                        id="address"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <LocationEdit className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Enter restaurant address</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">City</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-2"
                        placeholder="Mirpur"
                        type="text"
                        id="city"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <TowerControl className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Enter restaurant city</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">State</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-3"
                        placeholder="Mirpur"
                        type="text"
                        id="state"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <LocateFixed className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Enter restaurant state</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Postal code</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-4"
                        placeholder="6666"
                        type="text"
                        id="postal_code"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <Signpost className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter restaurant postal code
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Phone</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-5"
                        placeholder="01748888***"
                        type="text"
                        id="phone"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <PhoneCall className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Enter phone number</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="operating_hours"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Operating hours</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-6"
                        placeholder="8"
                        type="text"
                        id="operating_hours"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <AlarmClock className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Enter operation hours</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Capacity</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-7"
                        placeholder="50"
                        type="text"
                        id="capacity"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <Shuffle className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter capacity of the restaurant
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Status</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-8"
                        placeholder="open"
                        type="text"
                        id="status"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <LockKeyholeOpen className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter status of restaurant open or close
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="opening_time"
            render={({ field }) => (
              <FormItem className="col-span-12 flex flex-col gap-2 items-start">
                <FormLabel className="flex shrink-0">Opening time</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <input
                      type="time"
                      step="1" // allows seconds
                      {...field}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="closing_time"
            render={({ field }) => (
              <FormItem className="col-span-12 flex flex-col gap-2 items-start">
                <FormLabel className="flex shrink-0">Closing time</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <input
                      type="time"
                      step="1" // allows seconds
                      {...field}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="booking_fees_per_seat"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">
                  Booking fees per seat
                </FormLabel>
                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-9"
                        placeholder="100"
                        type="text"
                        id="booking_fees_per_seat"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <CircleDollarSign className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Booking fees per seat</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cuisine_type"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Cuisine type</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Select
                      key="select-0"
                      id="cuisine_type"
                      className=""
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="select cuisine type" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisines?.map((cuisine: any) => (
                          <SelectItem
                            key={`${cuisine.id}`}
                            value={`${cuisine.id}`}
                          >
                            {cuisine.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select restaurant cuisine type
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="restaurant_type"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Restaurant type</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Select
                      key="select-1"
                      id="restaurant_type"
                      className=""
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="select restaurant type" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: any) => (
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
                  <FormDescription>Select restaurant type</FormDescription>
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
  );
}
