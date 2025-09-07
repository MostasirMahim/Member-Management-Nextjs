import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, DollarSign, Users, Eye } from "lucide-react"
import Link from "next/link"
import useGetAllEvents from "@/hooks/data/useGetAllEvents"
import { Ticket } from "@/types"

interface TicketCardProps {
  ticket: Ticket
}

export function TicketCard({ ticket }: TicketCardProps) {
    const { data: AllEvents, isLoading } = useGetAllEvents();
  const event = AllEvents?.data?.find((e:any) => e.id === ticket.event)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "sold_out":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "discontinued":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">{ticket.ticket_name}</CardTitle>
          <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{ticket.ticket_description}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-semibold text-green-600">${ticket.price}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Capacity: {ticket.capacity}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>
            Sale: {new Date(ticket.start_sale_date).toLocaleDateString()} -{" "}
            {new Date(ticket.end_sale_date).toLocaleDateString()}
          </span>
        </div>

        {event && (
          <div className="text-sm">
            <span className="text-muted-foreground">Event: </span>
            <span className="font-medium">{event.title}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4">
        <Link href={`/events/tickets/${ticket.id}`} className="w-full">
          <Button variant="default" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
