"use client";
import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Check,
  X,
  Pencil,
  Trash2,
  FileSpreadsheet,
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

function AllMembers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const {setMemberID} = useAddMemberStore()
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const { data: allMembersReq, isLoading: user_isLoading } =
    useGetAllMembers(page);
  const allMembers = allMembersReq?.data;
  const paginationData = allMembersReq?.pagination;
  const { current_page, total_pages } = paginationData || {};

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
    router.push(`/member/update/${member_ID}`);
  };

  if (user_isLoading) return <LoadingDots />;
  return (
    <div className="space-y-6 ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ALL Members</h1>
          <p className="text-muted-foreground">
            A list of all members in the system.
          </p>
        </div>

        <div>
          <Button className="gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <div className="p-2">
                <Label htmlFor="role-filter" className="text-xs">
                  Role
                </Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role-filter">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Admin">Administrator</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Author">Author</SelectItem>
                    <SelectItem value="Reader">Reader</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-2">
                <Label htmlFor="status-filter" className="text-xs">
                  Status
                </Label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedRole("all");
                  setSelectedStatus("all");
                }}
              >
                Reset Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border my-2 font-secondary">
        <Table className="">
          <TableHeader>
            <TableRow className=" text-center font-bold h-14 bg-[#f9fafb] ">
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
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user: any) => (
                <TableRow
                  key={user.member_ID}
                  className="  cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out "
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
                        <DropdownMenuItem className="gap-2">
                          {true ? (
                            <>
                              <X className="h-4 w-4" /> Suspend
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4" /> Activate
                            </>
                          )}
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
