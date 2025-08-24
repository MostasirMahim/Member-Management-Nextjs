"use client";
import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  FileSpreadsheet,
  TrainTrackIcon,
  Calendar,
  Users,
  UserRoundSearch,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import useGetAllMembers from "@/hooks/data/useGetAllMembers";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { useAddMemberStore } from "@/store/store";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import useGetAllChoice from "@/hooks/data/useGetAllChoice";
import { Card } from "../ui/card";
import { getNames } from "country-list";

interface FilterState {
  date_of_birth?: Date;
  membership_type?: string;
  membership_status?: string;
  blood_group?: string;
  gender?: string;
  institute_name?: string;
  marital_status?: string;
  download_excel?: boolean | undefined;
  nationality?: string;
  contact_number?: string;
  email?: string;
  member_ID?: string;
  name?: string;
}
const initialFilters: FilterState = {
  date_of_birth: undefined,
  membership_type: "",
  membership_status: "pending",
  blood_group: "",
  gender: "",
  institute_name: "",
  marital_status: "",
  download_excel: undefined,

  nationality: "",
  contact_number: "",
  email: "",
  member_ID: "",
  name: "",
};
function AllMembers() {
  const [searchQuery, setSearchQuery] = useState("");
  const { setMemberID, memberID, setIsUpdateMode, isUpdateMode } =
    useAddMemberStore();
  const searchParams = useSearchParams();
  const countries = getNames();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUserFilterOpen, setIsUserFilterOpen] = useState(false);
  const page = Number(searchParams.get("page")) || 1;
  const {
    data: allMembersReq,
    isLoading: user_isLoading,
    refetch,
    isFetching,
  } = useGetAllMembers(page, filters);
  const allMembers = allMembersReq?.data;
  const paginationData = allMembersReq?.pagination;
  const { current_page, total_pages } = paginationData || {};
  const { data: choiceSections } = useGetAllChoice();

  const {
    membership_type,
    institute_name,
    gender,
    membership_status,
    marital_status,
  } = choiceSections ?? {};

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
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.member_ID.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }) || [];
  const router = useRouter();
  const handleMemberClick = (member_ID: string) => {
    router.push(`/member/view/${member_ID}`);
  };

  const goToPage = (page: number) => {
    if (page !== current_page) {
      router.push(`?page=${page}`);
      router.refresh();
    }
  };
  const handleExport = () => {
    updateFilter("download_excel", true);
    refetch();
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
  const handleUpdate = (member_ID: string) => {
    setMemberID(member_ID);
    setIsUpdateMode(true);
    router.push(`/member/update/${member_ID}`);
  };
  const handleIdTransfer = (member_ID: string) => {
    router.push(`/member/transferID/${member_ID}`);
  };

  if (user_isLoading) return <LoadingDots />;
  return (
    <div className="space-y-6 ">
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Members</h1>
          <p className="text-muted-foreground">
            A list of all of the pending members in the system.
          </p>
        </div>

        <div>
          <Button className="gap-1" onClick={handleExport}>
            <FileSpreadsheet className="h-4 w-4" />
            {isFetching ? "Exporting..." : "Export"}
          </Button>
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
              if (!isFilterOpen) setIsUserFilterOpen(false);
            }}
            className="gap-2 border-0 bg-background h-10 hover:bg-primary hover:text-primary-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsUserFilterOpen(!isUserFilterOpen);
              if (!isUserFilterOpen) setIsFilterOpen(false);
            }}
            className="gap-2 border-0 bg-background h-10 hover:bg-primary hover:text-primary-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <UserRoundSearch className="h-4 w-4" />
            Query
          </Button>
        </div>

        {isFilterOpen && (
          <div className="border-t-2 rounded-b-md mt-1 border-primary bg-background p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date of Birth
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-transparent"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.date_of_birth ? (
                        format(filters.date_of_birth, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={filters.date_of_birth}
                      onSelect={(date) => updateFilter("date_of_birth", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Membership Type
                </Label>
                <Select
                  value={filters.membership_type}
                  onValueChange={(value) =>
                    updateFilter("membership_type", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Membership Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {membership_type?.map((choice: any, index: number) => (
                      <SelectItem key={index} value={choice.name}>
                        {choice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Membership Status
                </Label>
                <Select
                  value={filters.membership_status}
                  onValueChange={(value) =>
                    updateFilter("membership_status", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Membership Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {membership_status?.map((choice: any, index: number) => (
                      <SelectItem key={index} value={choice.name}>
                        {choice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Blood Group
                </Label>
                <Select
                  value={filters.blood_group}
                  onValueChange={(value) => updateFilter("blood_group", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Institute Name
                </Label>
                <Select
                  value={filters.institute_name}
                  onValueChange={(value) =>
                    updateFilter("institute_name", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Institute" />
                  </SelectTrigger>
                  <SelectContent>
                    {institute_name?.map((choice: any, index: number) => (
                      <SelectItem key={index} value={choice.name}>
                        {choice.name} - {choice.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Marital Status
                </Label>
                <Select
                  value={filters.marital_status}
                  onValueChange={(value) =>
                    updateFilter("marital_status", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="What's Marital Status?" />
                  </SelectTrigger>
                  <SelectContent>
                    {marital_status?.map((choice: any, index: number) => (
                      <SelectItem key={index} value={choice.name}>
                        {choice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Gender
                </Label>
                <Select
                  value={filters.gender}
                  onValueChange={(value) => updateFilter("gender", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Gender">
                      {filters.gender}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {gender?.map((choice: any, index: number) => (
                      <SelectItem key={index} value={choice.name}>
                        {choice.name}
                      </SelectItem>
                    ))}
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
        {isUserFilterOpen && (
          <div className="border-t-2 rounded-b-md mt-1 border-primary bg-background p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Member ID</Label>
                <Input
                  type="text"
                  placeholder="Search by ID..."
                  className="bg-background"
                  value={filters.member_ID}
                  onChange={(e) => updateFilter("member_ID", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Name</Label>
                <Input
                  type="text"
                  placeholder="Search by name..."
                  className="bg-background"
                  value={filters.name}
                  onChange={(e) => updateFilter("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contact Number</Label>
                <Input
                  type="text"
                  placeholder="Search by contact..."
                  className="bg-background"
                  value={filters.contact_number}
                  onChange={(e) =>
                    updateFilter("contact_number", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <Input
                  type="text"
                  placeholder="Search by email..."
                  className="bg-background"
                  value={filters.email}
                  onChange={(e) => updateFilter("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Nationality
                </Label>
                <Select
                  value={filters.nationality}
                  onValueChange={(value) => updateFilter("nationality", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries?.map((name: any, index: number) => (
                      <SelectItem key={index} value={name}>
                        {name}
                      </SelectItem>
                    ))}
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
        <Table className="">
          <TableHeader>
            <TableRow className=" text-center font-bold h-14 bg-background border-b-2 border-primary dark:bg-accent">
              <TableHead className=" text-black dark:text-white font-bold  ">
                ID
              </TableHead>
              <TableHead className="text-black dark:text-white font-bold">
                Member
              </TableHead>
              <TableHead className="text-black dark:text-white font-bold">
                Type
              </TableHead>
              <TableHead className=" text-black dark:text-white font-bold">
                Status
              </TableHead>
              <TableHead className="text-black dark:text-white font-bold">
                Batch
              </TableHead>
              <TableHead className=" text-black dark:text-white font-bold text-center">
                Martial St.
              </TableHead>
              <TableHead className="text-black dark:text-white font-bold text-center">
                DOB
              </TableHead>
              <TableHead className=" text-black dark:text-white font-bold">
                Blood Group
              </TableHead>
              <TableHead className="text-black dark:text-white font-bold ">
                Nationality
              </TableHead>
              <TableHead className="text-black dark:text-white text-right font-bold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-red-500 font-medium"
                >
                  <Card className="p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Users className="h-12 w-12 text-muted-foreground" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">No users found</h3>
                        <p className="text-sm text-muted-foreground">
                          No members match your current filter criteria. Try
                          adjusting your filters or reset to see all members.
                        </p>
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
                  key={user.member_ID}
                  className="  cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out bg-background "
                >
                  <TableCell
                    className="font-medium "
                    onClick={() => handleMemberClick(user.member_ID)}
                  >
                    {user.member_ID}
                  </TableCell>
                  <TableCell
                    className="flex justify-start items-center"
                    onClick={() => handleMemberClick(user.member_ID)}
                  >
                    <div className="space-y-1 ">
                      <p className="font-medium text-left">
                        {user.first_name + " " + user.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground text-left">
                        {user.institute_name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell onClick={() => handleMemberClick(user.member_ID)}>
                    <p>{user.membership_type}</p>
                  </TableCell>
                  <TableCell onClick={() => handleMemberClick(user.member_ID)}>
                    <Badge
                      variant={"default"}
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      {user.membership_status}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={() => handleMemberClick(user.member_ID)}>
                    {user.batch_number || "-"}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    onClick={() => handleMemberClick(user.member_ID)}
                  >
                    {user.marital_status || "-"}
                  </TableCell>
                  <TableCell onClick={() => handleMemberClick(user.member_ID)}>
                    {user.date_of_birth || "-"}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    onClick={() => handleMemberClick(user.member_ID)}
                  >
                    {user.blood_group || "-"}
                  </TableCell>
                  <TableCell onClick={() => handleMemberClick(user.member_ID)}>
                    {user.nationality || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => handleUpdate(user.member_ID)}
                        >
                          <Pencil className="h-4 w-4" /> Update
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => handleIdTransfer(user.member_ID)}
                        >
                          <TrainTrackIcon className="h-4 w-4" /> Transfer ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive gap-2">
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default AllMembers;
