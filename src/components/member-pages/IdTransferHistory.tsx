"use client";
import { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  HistoryIcon,
  Train,
  TrainTrackIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LoadingDots, LoadingPage } from "@/components/ui/loading";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Card } from "../ui/card";
import { getNames } from "country-list";
import useGetTransferHistory from "@/hooks/data/useGetTransferHistory";
import { formatPostDate } from "@/lib/date_modify";

interface FilterState {
  start_date?: Date;
  end_date?: Date;
  transferred?: boolean;
}
const initialFilters: FilterState = {
  start_date: undefined,
  end_date: undefined,
  transferred: undefined,
};
function IdTransferHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const countries = getNames();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const page = Number(searchParams.get("page")) || 1;
  const {
    data: allMembersReq,
    isLoading: user_isLoading,
    refetch,
    isFetching,
  } = useGetTransferHistory(page, filters);
  const allMembers = allMembersReq?.data;
  const paginationData = allMembersReq?.pagination;
  const { current_page, total_pages } = paginationData || {};

  const updateFilter = (
    key: keyof FilterState,
    value: string | boolean | Date | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchQuery("");
    setTimeout(() => refetch(), 0);
  };
  const resetRetry = () => {
    setFilters(initialFilters);
    setSearchQuery("");
    setIsFilterOpen(false);
    setTimeout(() => refetch(), 0);
  };

  const filteredUsers =
    allMembers?.filter((user: any) => {
      const matchesSearch =
        user.transferred_reason
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        user.stored_member_id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }) || [];
  const router = useRouter();

  const goToPage = (page: number) => {
    if (page !== current_page) {
      router.push(`?page=${page}`);
      router.refresh();
    }
  };
  const renderPageLinks = () => {
    const pagesToShow = [];

    for (let i = 1; i <= total_pages; i++) {
      pagesToShow.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => goToPage(i)}
            isActive={i === current_page}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pagesToShow;
  };
  if (user_isLoading) return <LoadingDots />;
  return (
    <div className="space-y-6 ">
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            ID Transferred History
          </h1>
          <p className="text-muted-foreground">
            A list of all ID transferred history in the system.
          </p>
        </div>
      </div>
      <div
        className={`w-full  ${
          isFilterOpen ? "shadow-lg border rounded-lg" : ""
        }`}
      >
        <div className="flex gap-2 ">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-10 border-0 bg-background focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
            }}
            className="gap-2 border-0 bg-background h-10 hover:bg-primary hover:text-primary-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {isFilterOpen && (
          <div className="border-t-2 rounded-b-md mt-1 border-primary bg-background p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-transparent"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.start_date ? (
                        format(filters.start_date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      captionLayout="dropdown"
                      selected={filters.start_date}
                      onSelect={(date) => {
                        if (date) {
                          const formatted = format(date, "yyyy-MM-dd");
                          updateFilter("start_date", formatted);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-transparent"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.end_date ? (
                        format(filters.end_date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      captionLayout="dropdown"
                      selected={filters.end_date}
                      onSelect={(date) => {
                        if (date) {
                          const formatted = format(date, "yyyy-MM-dd");
                          updateFilter("end_date", formatted);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <TrainTrackIcon className="h-4 w-4" />
                  Transferred
                </Label>
                <Select
                  value={
                    filters.transferred === undefined
                      ? ""
                      : filters.transferred
                      ? "true"
                      : "false"
                  }
                  onValueChange={(value) =>
                    updateFilter("transferred", value === "true")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Yes or No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className=" flex items-center justify-center gap-2">
                <Button className="mt-4" onClick={() => refetch()}>
                  <Filter className="h-4 w-4" />
                  {isFetching ? "Filtering..." : "Apply"}
                </Button>
                <Button
                  className="mt-4"
                  variant="destructive"
                  onClick={() => resetFilters()}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="rounded-md border my-2 font-secondary">
        <Table>
          <TableHeader>
            <TableRow className=" text-center font-bold h-14 bg-background border-b-2 border-primary dark:bg-accent">
              <TableHead className="text-black dark:text-white font-bold  text-center">
                ID
              </TableHead>
              <TableHead className="text-black dark:text-white font-bold">
                Current ID
              </TableHead>
              <TableHead className="text-black dark:text-white font-bold">
                Transferred from ID
              </TableHead>
              <TableHead className="text-black dark:text-white font-bold">
                Reason
              </TableHead>
              <TableHead className="text-black dark:text-white font-bold text-center">
                Transferred
              </TableHead>
              <TableHead className="text-black dark:text-white font-bold text-center">
                Start Date
              </TableHead>
              <TableHead className="text-black dark:text-white font-bold text-center">
                End Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-red-500 font-medium"
                >
                  <Card className="p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <HistoryIcon className="h-12 w-12 text-muted-foreground" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          No History Found
                        </h3>
                      </div>
                      <Button
                        onClick={resetRetry}
                        variant="outline"
                        className="gap-2 bg-transparent text-green-600"
                      >
                        <Search className="h-4 w-4" />
                        {isFetching ? "Retrying Search.." : "Reset Filters"}
                      </Button>
                    </div>
                  </Card>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user: any) => (
                <TableRow
                  key={user.id}
                  className="  cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out bg-background "
                >
                  <TableCell className="font-medium ">{user.id}</TableCell>
                  <TableCell>
                    <p className="font-medium text-left">{user.member}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-left">
                      {user.stored_member_id}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-left">
                      {user.transferred_reason}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={"default"}
                      className={`${
                        user.transferred
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      } px-2 py-1 rounded-full text-xs font-semibold`}
                    >
                      {user.transferred ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <p className="font-medium text-left">
                      {formatPostDate(user.start_date)}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <p className="font-medium text-left">
                      {formatPostDate(user.start_date)}
                    </p>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* -- PAGINATION -- */}
      <div className=" flex justify-center">
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            {paginationData?.previous && (
              <PaginationItem className="cursor-pointer">
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(current_page - 1);
                  }}
                />
              </PaginationItem>
            )}

            {/* Page Numbers */}
            {renderPageLinks()}

            {/* Next Button */}
            {paginationData?.next && (
              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(current_page + 1);
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default IdTransferHistory;
