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
import {
  MoreVertical,
  Eye,
  Trash2,
  DollarSign,
  User,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IncomeSearchFilterSection } from "./IncomeSearchFilterSection";
import { SmartPagination } from "@/components/utils/SmartPagination"; 

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

  // Pagination & Filters
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 10;

  const filterOptions = {
    members: Array.from(new Set(incomes.data.map((i) => i.member))),
    received_by: Array.from(new Set(incomes.data.map((i) => i.received_by))),
    receiving_types: Array.from(
      new Set(incomes.data.map((i) => i.receiving_type))
    ),
  };

  const filterMember = searchParams.get("member") || "";
  const filterReceivedBy = searchParams.get("received_by") || "all";
  const filterReceivingType = searchParams.get("receiving_type") || "all";

  const filteredIncomes = incomes.data.filter((i) => {
    if (
      filterMember &&
      !i.member.toLowerCase().includes(filterMember.toLowerCase())
    )
      return false;
    if (filterReceivedBy !== "all" && i.received_by !== filterReceivedBy)
      return false;
    if (
      filterReceivingType !== "all" &&
      i.receiving_type !== filterReceivingType
    )
      return false;
    return true;
  });

  // Calculate pagination for SmartPagination
  const totalPages = Math.ceil(filteredIncomes.length / itemsPerPage);
  const currentPage = pageParam > totalPages ? 1 : pageParam;
  const paginatedIncomes = filteredIncomes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // PaginationData format for SmartPagination
  const paginationData = {
    count: filteredIncomes.length,
    total_pages: totalPages,
    current_page: currentPage,
    next: currentPage < totalPages ? `?page=${currentPage + 1}` : null,
    previous: currentPage > 1 ? `?page=${currentPage - 1}` : null,
    page_size: itemsPerPage,
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="">
      <div>
        <CardHeader>
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
            <Table className="min-w-[900px] text-sm text-gray-700 dark:text-gray-300">
              <TableHeader className="bg-gray-100 dark:bg-gray-800">
                <TableRow className="bg-gray-100 dark:bg-gray-700 font-bold text-sm">
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
                    className="hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-all duration-200"
                  >
                    <TableCell className="font-semibold">{i.id}</TableCell>
                    <TableCell>
                      <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-300 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-700">
                        {i.particular}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {i.member}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700">
                        {i.received_by}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 border border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700">
                        {i.receiving_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-700 dark:text-gray-300">
                        {i.sale}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-indigo-700 dark:text-indigo-300">
                        {i.receivable_amount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-yellow-700 dark:text-yellow-400">
                        {i.final_receivable}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-green-700 dark:text-green-300">
                        {i.actual_received}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-700 dark:text-gray-300">
                        {i.date ? new Date(i.date).toLocaleString() : ""}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          i.is_active
                            ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors"
                            : "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors"
                        }
                      >
                        {i.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="dark:bg-gray-800 dark:text-gray-200"
                        >
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/mfm/income/${i.id}`}
                              className="flex items-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 cursor-pointer"
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

          {/* Smart Pagination */}
          <SmartPagination paginationData={paginationData} />
        </CardContent>
      </div>
    </div>
  );
}
