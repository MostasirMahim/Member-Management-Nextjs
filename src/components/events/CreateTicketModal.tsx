"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import useGetAllEvents from "@/hooks/data/useGetAllEvents";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

const ticketSchema = Yup.object({
  ticket_name: Yup.string()
    .required("Ticket name is required")
    .min(3, "Ticket name must be at least 3 characters"),
  ticket_description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive")
    .min(0.01, "Price must be at least $0.01"),
  capacity: Yup.number()
    .required("Capacity is required")
    .positive("Capacity must be positive")
    .integer("Capacity must be a whole number"),
  start_sale_date: Yup.date()
    .required("Start sale date is required")
    .min(new Date(), "Start date cannot be in the past"),
  end_sale_date: Yup.date()
    .required("End sale date is required")
    .min(Yup.ref("start_sale_date"), "End date must be after start date"),
  status: Yup.string()
    .required("Status is required")
    .oneOf(["available", "sold_out", "discontinued"], "Invalid status"),
  event: Yup.number()
    .required("Event is required")
    .positive("Please select an event"),
});

export function CreateTicketModal() {
  const [open, setOpen] = useState(false);
  const { data: AllEvents, isLoading } = useGetAllEvents();
  const queryClient = useQueryClient();
  const { mutate: createTicket, isPending } = useMutation({
    mutationFn: async (Data: any) => {
      const res = await axiosInstance.post(
        "/api/event/v1/events/tickets/",
        Data
      );
      return res.data;
    },
    onSuccess: async (data) => {
      if (data?.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["getAllTickets"] });
        formik.resetForm();
        setOpen(false);
        toast.success("Ticket Created Successfully");
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          formik.setFieldError(
            field,
            Array.isArray(messages) ? messages[0] : messages
          );
        });
        toast.error(detail || "An error occurred during Added");
      } else {
        toast.error(message || "An error occurred during Added");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      ticket_name: "",
      ticket_description: "",
      price: "",
      capacity: "",
      start_sale_date: "",
      end_sale_date: "",
      status: "",
      event: undefined,
    },
    validationSchema: ticketSchema,
    onSubmit: (values) => {
      createTicket(values);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Create Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticket_name">Ticket Name</Label>
              <Input
                id="ticket_name"
                name="ticket_name"
                value={formik.values.ticket_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="VIP Pass"
              />
              {formik.touched.ticket_name && formik.errors.ticket_name && (
                <p className="text-sm text-red-500">
                  {formik.errors.ticket_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="99.99"
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-sm text-red-500">{formik.errors.price}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticket_description">Description</Label>
            <Textarea
              id="ticket_description"
              name="ticket_description"
              value={formik.values.ticket_description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Access to VIP lounge and priority entry"
              rows={3}
            />
            {formik.touched.ticket_description &&
              formik.errors.ticket_description && (
                <p className="text-sm text-red-500">
                  {formik.errors.ticket_description}
                </p>
              )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="100"
              />
              {formik.touched.capacity && formik.errors.capacity && (
                <p className="text-sm text-red-500">{formik.errors.capacity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formik.values.status}
                onValueChange={(value) => formik.setFieldValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold_out">Sold Out</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.status && formik.errors.status && (
                <p className="text-sm text-red-500">{formik.errors.status}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_sale_date">Start Sale Date</Label>
              <Input
                id="start_sale_date"
                name="start_sale_date"
                type="datetime-local"
                value={formik.values.start_sale_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.start_sale_date &&
                formik.errors.start_sale_date && (
                  <p className="text-sm text-red-500">
                    {formik.errors.start_sale_date}
                  </p>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_sale_date">End Sale Date</Label>
              <Input
                id="end_sale_date"
                name="end_sale_date"
                type="datetime-local"
                value={formik.values.end_sale_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.end_sale_date && formik.errors.end_sale_date && (
                <p className="text-sm text-red-500">
                  {formik.errors.end_sale_date}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event">Event</Label>
            <Select
              value={formik.values.event}
              onValueChange={(value) =>
                formik.setFieldValue("event", Number(value))
              }
            >
              <SelectTrigger>
                <SelectValue>
                  {formik.values.event
                    ? AllEvents?.data?.find(
                        (event: any) => event.id === formik.values.event
                      )?.title
                    : "Select an event"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {AllEvents?.data?.map((event: any) => (
                  <SelectItem key={event.id} value={event.id.toString()}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.event && formik.errors.event && (
              <p className="text-sm text-red-500">{formik.errors.event}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false), formik.resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
