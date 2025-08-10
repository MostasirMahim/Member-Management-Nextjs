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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useRouter } from "next/navigation";

function AllMembers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { data: allMembersReq, isLoading: user_isLoading } = useGetAllMembers();
  const allMembers = allMembersReq?.data;
  const allMembersPages = allMembersReq?.pagination;

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
    router.push(`/member/${member_ID}`);
  };
  if (user_isLoading) return <LoadingDots />;
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ALL Members</h1>
          <p className="text-muted-foreground">
            Total {allMembers?.length} Members
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
      <div className="rounded-md border my-2">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50  text-center">
              <TableHead className=" text-center">ID</TableHead>
              <TableHead className=" text-center">User</TableHead>
              <TableHead className=" text-center">Type</TableHead>
              <TableHead className=" text-center">Status</TableHead>
              <TableHead className=" text-center">Batch No.</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                  onClick={() => handleMemberClick(user.member_ID)}
                  className=" text-center cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out "
                >
                  <TableCell className="font-medium">
                    {user.member_ID}
                  </TableCell>
                  <TableCell className="flex justify-center items-center">
                    <div></div>
                    <div className="flex items-center justify-start  gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.profile_photo || "/user.png"}
                          alt={user.first_name + " " + user.last_name}
                        />
                        <AvatarFallback>
                          {user.first_name.charAt(0) +
                            user.last_name.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user.first_name + " " + user.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground text-left">
                          {user.institute_name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>{user.membership_type}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={"default"}
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      {user.membership_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.batch_number || "-"}</TableCell>
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
                        <DropdownMenuItem className="gap-2">
                          <Pencil className="h-4 w-4" /> Edit
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong>1</strong> to <strong>{filteredUsers.length}</strong>{" "}
          of <strong>{filteredUsers.length}</strong> users
        </p>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AllMembers;
