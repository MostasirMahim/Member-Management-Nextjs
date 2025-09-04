"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TicketIcon } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetTicket from "@/hooks/data/useGetTicket";
import { LoadingDots } from "@/components/ui/loading";

interface PurchasePageProps {
  params: {
    id: string;
  };
}

const purchaseSchema = Yup.object({
  event_ticket: Yup.number()
    .required("Event ticket is required")
    .positive("Invalid ticket ID"),
  member_ID: Yup.string().required("Member ID is required"),
});

export default function PurchasePage({ params }: PurchasePageProps) {
  const ticketId = params.id;
  const { data: ticket, isLoading: ticketLoading } = useGetTicket(ticketId);

  const queryClient = useQueryClient();
  const { mutate: buyTicket, isPending } = useMutation({
    mutationFn: async (Data: any) => {
      const res = await axiosInstance.post(
        "/api/event/v1/events/tickets/buy/",
        Data
      );
      return res.data;
    },
    onSuccess: async (data) => {
      if (data?.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["getAllTickets"] });
        formik.resetForm();
        toast.success("Ticket Bought Successfully");
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
      event_ticket: ticketId,
      member_ID: "",
    },
    validationSchema: purchaseSchema,
    onSubmit: (values) => {
      buyTicket(values);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "sold_out":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "discontinued":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };
  if (ticketLoading) {
    return <LoadingDots />;
  }
  return (
    <div className="container mx-auto ">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TicketIcon className="h-5 w-5" />
                  Purchase Ticket
                </CardTitle>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {ticket.ticket_name}
                  </h3>
                  <p className="text-muted-foreground">
                    {ticket.ticket_description}
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Price per ticket</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    ${ticket.price}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Purchase Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event_ticket">Event Ticket ID</Label>
                  <Input
                    id="event_ticket"
                    name="event_ticket"
                    type="number"
                    value={formik.values.event_ticket}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                    className="bg-muted"
                  />
                  {formik.touched.event_ticket &&
                    formik.errors.event_ticket && (
                      <p className="text-sm text-red-500">
                        {formik.errors.event_ticket}
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="member_ID">Member ID</Label>
                  <Input
                    id="member_ID"
                    name="member_ID"
                    value={formik.values.member_ID}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="GM0001-PU"
                  />
                  {formik.touched.member_ID && formik.errors.member_ID && (
                    <p className="text-sm text-red-500">
                      {formik.errors.member_ID}
                    </p>
                  )}
                </div>

                <div className="pt-4 space-y-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">${ticket.price}</span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending || ticket.status !== "available"}
                  >
                    {ticket.status === "available"
                      ? `${isPending ? "Buying Ticket..." : "Buy Ticket"}`
                      : "Not Available"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
