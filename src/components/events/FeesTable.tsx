"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus } from "lucide-react";
import useGetAllEvents from "@/hooks/data/useGetAllEvents";
import useGetAllChoice from "@/hooks/data/useGetAllChoice";
import useGetAllFees from "@/hooks/data/useGetAllFees";
import { LoadingDots } from "../ui/loading";


interface FeesTableProps {
  onCreateFee: () => void;
}

export function FeesTable({ onCreateFee }: FeesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [memberTypeFilter, setMemberTypeFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;

  const { data: AllEvents, isLoading } = useGetAllEvents();
  const { data: AllFees, isLoading: feeLoading } = useGetAllFees();
  const { data: choiceSections, isLoading: choiceLoading } = useGetAllChoice();
  const { membership_type } = choiceSections ?? {};

  const filteredFees = useMemo(() => {
    if (!AllFees?.data) return [];

    return AllFees.data.filter((fee: any) => {
      const event = AllEvents?.data?.find((e: any) => e.id === fee.event);
      const eventTitle = event?.title || "";

      const matchesSearch =
        searchTerm === "" ||
        eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.event.toString().includes(searchTerm);

      const matchesMemberType =
        memberTypeFilter === "all" ||
        fee.membership_type.name === memberTypeFilter;

      const matchesEvent =
        eventFilter === "all" || fee.event.toString() === eventFilter;

      const feeAmount = Number.parseFloat(fee.fee);
      const matchesMinPrice =
        minPrice === "" || feeAmount >= Number.parseFloat(minPrice);
      const matchesMaxPrice =
        maxPrice === "" || feeAmount <= Number.parseFloat(maxPrice);

      return (
        matchesSearch &&
        matchesMemberType &&
        matchesEvent &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [
    AllFees?.data,
    AllEvents?.data,
    searchTerm,
    memberTypeFilter,
    eventFilter,
    minPrice,
    maxPrice,
  ]);

  const totalPages = Math.ceil(filteredFees?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFees = filteredFees?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getEventTitle = (eventId: number) => {
    const event = AllEvents?.data?.find((e: any) => e.id === eventId);
    return event?.title || `Event ${eventId}`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setMemberTypeFilter("all");
    setEventFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilters(false);
  };

  if (isLoading || feeLoading || choiceLoading) return <LoadingDots />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Fees Management</h1>
          <p className="text-muted-foreground">
            Manage event fees and membership pricing
          </p>
        </div>
        <Button onClick={onCreateFee} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 " />
          Create Fee
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 ">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="search.."
              placeholder="Search users..."
              className="pl-10 border-0 bg-background focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 border-0 bg-background h-10 hover:bg-primary hover:text-primary-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {showFilters && (
          <Card className="border-t-4 border-t-blue-500">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Member Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Membership Type
                  </label>
                  <Select
                    value={memberTypeFilter}
                    onValueChange={setMemberTypeFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Membership Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {membership_type?.map((type: any) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Event
                  </label>
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      {AllEvents?.data?.map((event: any) => (
                        <SelectItem key={event.id} value={event.id.toString()}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Min Price
                  </label>
                  <Input
                    type="number"
                    placeholder="Minimum amount"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Max Price
                  </label>
                  <Input
                    type="number"
                    placeholder="Maximum amount"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200 dark:bg-red-950 dark:hover:bg-red-900 dark:text-red-400 dark:border-red-800"
                >
                  Reset
                </Button>
                <Button
                  onClick={applyFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="font-bold h-14 bg-background border-b-2 border-primary dark:bg-accent">
                  <TableHead>ID</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Membership Type</TableHead>
                  <TableHead>Fee Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFees?.map((fee: any) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium">#{fee.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {getEventTitle(fee.event)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Event ID: {fee.event}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {fee.membership_type?.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${fee.fee}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={fee.is_active ? "default" : "secondary"}>
                        {fee.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(fee.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {paginatedFees?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No fees found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
