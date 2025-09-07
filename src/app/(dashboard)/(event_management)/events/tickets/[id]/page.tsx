"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  DollarSign,
  Users,
  MapPin,
  Clock,
  User,
} from "lucide-react";
import Link from "next/link";
import useGetAllEvents from "@/hooks/data/useGetAllEvents";
import useGetTicket from "@/hooks/data/useGetTicket";
import { LoadingDots } from "@/components/ui/loading";

export default function TicketDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: AllEvents, isLoading } = useGetAllEvents();
  const { data: ticket, isLoading: ticketLoading } = useGetTicket(id);
  const event = AllEvents?.data?.find((e: any) => e.id === ticket?.event);
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

  if (isLoading || ticketLoading) return <LoadingDots />;
  return (
    <div className="container mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ticket Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl">
                    {ticket?.ticket_name}
                  </CardTitle>
                  <Badge className={getStatusColor(ticket?.status)}>
                    {ticket?.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {ticket?.ticket_description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-semibold text-green-600">
                        ${ticket?.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="font-semibold">
                        {ticket?.capacity} tickets
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Sale Period
                      </p>
                      <p className="font-medium">
                        {new Date(ticket?.start_sale_date).toLocaleDateString()}{" "}
                        - {new Date(ticket?.end_sale_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium">
                        {new Date(ticket?.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Information */}
            {event && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{event?.title}</h3>
                    <p className="text-muted-foreground mt-1">
                      {event?.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Event Date
                        </p>
                        <p className="font-medium">
                          {new Date(event?.start_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Organizer
                        </p>
                        <p className="font-medium">
                          {event?.organizer?.member_ID}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Venue</p>
                      <p className="font-medium">
                        {event?.venue?.street_address}, {event?.venue?.city},{" "}
                        {event?.venue?.state_province}{" "}
                        {event?.venue?.postal_code}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Purchase Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Purchase Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    ${ticket.price}
                  </p>
                  <p className="text-sm text-muted-foreground">per ticket</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>{ticket?.capacity}</strong> tickets available
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sale ends:{" "}
                    <strong>
                      {new Date(ticket?.end_sale_date).toLocaleDateString()}
                    </strong>
                  </p>
                </div>

                <Link
                  href={`/events/tickets/${ticket?.id}/purchase`}
                  className="w-full block"
                >
                  <Button
                    className="w-full"
                    disabled={ticket?.status !== "available"}
                  >
                    {ticket?.status === "available"
                      ? "Buy Ticket"
                      : "Not Available"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
