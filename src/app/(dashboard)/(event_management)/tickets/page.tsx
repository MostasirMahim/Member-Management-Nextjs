"use client"
import { useState } from "react"
import { CreateTicketModal } from "@/components/events/CreateTicketModal"
import { EventPagination } from "@/components/events/EventPagination"
import { TicketCard } from "@/components/events/TicketCard"
import useGetAllTickets from "@/hooks/data/useGetAllTickets"
import { LoadingDots } from "@/components/ui/loading"

const ITEMS_PER_PAGE = 10

export default function TicketsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: AllTickets, isLoading } = useGetAllTickets();
  const totalPages = Math.ceil(AllTickets?.data?.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTickets = AllTickets?.data?.slice(startIndex, endIndex)

  if(isLoading) return <LoadingDots />
  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tickets</h1>
          <p className="text-muted-foreground mt-2">Manage event tickets and pricing</p>
        </div>
        <CreateTicketModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {currentTickets?.map((ticket:any) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>

      {totalPages > 1 && <EventPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  )
}
