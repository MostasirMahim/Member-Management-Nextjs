"use client";

import { useState } from "react";
import { CreateVenueModal } from "@/components/events/CreateVanueModal";
import { VenueCard } from "@/components/events/VanueCard";
import { EventPagination } from "@/components/events/EventPagination";
import useGetAllVenues from "@/hooks/data/useGetAllVenues";
import { LoadingDots } from "@/components/ui/loading";

const ITEMS_PER_PAGE = 10;

export default function VenuesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: AllVenues, isLoading } = useGetAllVenues();
  const totalPages = Math.ceil(AllVenues?.data?.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVenues = AllVenues?.data?.slice(startIndex, endIndex);

  if (isLoading) return <LoadingDots />;
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto ">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Venues</h1>
            <p className="text-muted-foreground">
              Manage your event venues and locations
            </p>
          </div>
          <CreateVenueModal />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 mb-8">
          {currentVenues?.map((venue: any) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>

        <EventPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
