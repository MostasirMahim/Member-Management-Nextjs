"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function DashboardFilterButton() {
  const [openAlert, setOpenAlert] = useState(false);
  return (
    <div>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Filter by date!</AlertDialogTitle>
            <AlertDialogDescription>
              <GeneratedForm setOpenAlert={setOpenAlert} />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <p className="text-center">You can apply one filter at a time.</p>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button size="lg" onClick={() => setOpenAlert(true)}>
        Filter
      </Button>
    </div>
  );
}

export default DashboardFilterButton;

interface Props {
  setOpenAlert: any;
}

function GeneratedForm({ setOpenAlert }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm({
    defaultValues: {
      created_at: "",
      created_at_after: "",
      created_at_before: "",
      submit: "",
      cancel: "",
      clear: "",
    },
  });

  function clearFilters() {
    router.push(pathname);
    router.refresh();
    setOpenAlert(false);
  }

  function onSubmit(values: any) {
    const { created_at, created_at_after, created_at_before } = values;
    if (created_at) {
      const formattedDate = formatDateString(created_at);
      router.push(`?created_at=${formattedDate}`);
    } else if (created_at_after) {
      const formattedDate = formatDateString(created_at_after);
      router.push(`?created_at_after=${formattedDate}`);
    } else if (created_at_before) {
      const formattedDate = formatDateString(created_at_before);
      router.push(`?created_at_before=${formattedDate}`);
    }
    router.refresh();
    setOpenAlert(false);
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
            name="created_at"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Created at</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="justify-start text-left font-normal w-full"
                          id="created_at"
                          name="created_at"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-muted-foreground">
                              Pick a date
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          initialFocus
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>Filter by created at</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="created_at_after"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Created after</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="justify-start text-left font-normal w-full"
                          id="created_at_after"
                          name="created_at_after"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-muted-foreground">
                              Pick a date
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>Filter by created after</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="created_at_before"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Created before</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="justify-start text-left font-normal w-full"
                          id="created_at_before"
                          name="created_at_before"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-muted-foreground">
                              Pick a date
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          initialFocus
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>Filter by created before</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clear"
            render={({ field }) => (
              <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="hidden shrink-0">clear filter</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Button
                      key="button-0"
                      id="button-0"
                      name=""
                      className="w-full"
                      type="button"
                      variant="outline"
                      onClick={clearFilters}
                    >
                      Clear filter
                    </Button>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="submit"
            render={({ field }) => (
              <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="hidden shrink-0">Submit</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Button
                      key="submit-button-0"
                      id="submit"
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
          <FormField
            control={form.control}
            name="cancel"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="hidden shrink-0">cancel</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Button
                      key="button-1"
                      id="button-1"
                      name=""
                      className="w-full"
                      type="button"
                      variant="outline"
                      onClick={() => setOpenAlert(false)}
                    >
                      Cancel
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

function formatDateString(dateStr: string): string {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
