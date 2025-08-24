"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Eye, Trash2, DollarSign, User, CalendarDays } from "lucide-react";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { IncomeSearchFilterSection } from "./IncomeSearchFilterSection";

interface Income {
  id: number;
  particular: string;
  received_from_type: string;
  receiving_type: string;
  member: string;
  received_by: string;
  sale: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  date: string;
  receivable_amount: string;
  discount_name: string;
  discounted_amount: string;
  final_receivable: string;
  actual_received: string;
  reaming_due: string;
  due_payable_last_date: string | null;
}

interface IncomesResponse {
  code: number;
  status: string;
  message: string;
  data: Income[];
  pagination: {
    count: number;
    total_pages: number;
    current_page: number;
    next: string | null;
    previous: string | null;
    page_size: number;
  };
}

interface Props {
  incomes: IncomesResponse;
}

export default function IncomeTable({ incomes }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Pagination
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 10;

  // Filter options build
  const filterOptions = {
    members: Array.from(new Set(incomes.data.map((i) => i.member))),
    received_by: Array.from(new Set(incomes.data.map((i) => i.received_by))),
    receiving_types: Array.from(new Set(incomes.data.map((i) => i.receiving_type))),
  };

  // Filters
  const filterMember = searchParams.get("member") || "";
  const filterReceivedBy = searchParams.get("received_by") || "all";
  const filterReceivingType = searchParams.get("receiving_type") || "all";

  // Filter incomes
  const filteredIncomes = incomes.data.filter((i) => {
    if (filterMember && !i.member.toLowerCase().includes(filterMember.toLowerCase())) return false;
    if (filterReceivedBy !== "all" && i.received_by !== filterReceivedBy) return false;
    if (filterReceivingType !== "all" && i.receiving_type !== filterReceivingType) return false;
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredIncomes.length / itemsPerPage);
  const currentPage = pageParam > totalPages ? 1 : pageParam;
  const paginatedIncomes = filteredIncomes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="">
      <div >
        <CardHeader className="">
          <div className="flex flex-row items-center gap-2">
            <DollarSign className="h-7 w-7 text-gray-700 drop-shadow" />
            <CardTitle className="text-xl md:text-2xl font-extrabold text-gray-700 tracking-tight">
              All Incomes
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <IncomeSearchFilterSection filterOptions={filterOptions} />

          <div className="overflow-x-auto ">
            <Table className="min-w-[900px] text-sm text-gray-700">
              <TableHeader className="bg-gray-100">
                <TableRow className="bg-gray-200 font-bold text-sm">
                  <TableHead>ID</TableHead>
                  <TableHead>Particular</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" /> Member
                    </div>
                  </TableHead>
                  <TableHead>Received By</TableHead>
                  <TableHead>Receiving Type</TableHead>
                  <TableHead>Sale</TableHead>
                  <TableHead>Receivable</TableHead>
                  <TableHead>Final</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" /> Date
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedIncomes.map((i) => (
                  <TableRow
                    key={i.id}
                    className="hover:bg-indigo-50 transition-all duration-200"
                  >
                    <TableCell className="font-semibold">{i.id}</TableCell>
                    <TableCell>
                      <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-300">
                        {i.particular}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-800">{i.member}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
                        {i.received_by}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 border border-green-300">
                        {i.receiving_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-700">{i.sale}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-indigo-700">{i.receivable_amount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-yellow-700">{i.final_receivable}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-green-700">{i.actual_received}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-700">
                        {i.date ? new Date(i.date).toLocaleString() : ""}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          i.is_active
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {i.is_active ? "active" : "inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-indigo-600"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/mfm/income/${i.id}`}
                              className="flex items-center text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 hover:bg-red-100 cursor-pointer"
                            onClick={() => {
                              setSelectedIncome(i);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination className="mt-4 justify-center flex cursor-pointer">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <PaginationPrevious />
            </button>
            <PaginationContent>
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page} onClick={() => goToPage(page)}>
                    <PaginationLink isActive={page === currentPage}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            </PaginationContent>
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <PaginationNext />
            </button>
          </Pagination>
        </CardContent>
      </div>
    </div>
  );
}