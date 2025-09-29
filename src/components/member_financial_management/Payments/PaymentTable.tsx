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
import { MoreVertical, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { PaymentSearchFilterSection } from "./PaymentSearchFilterSection";
import { SmartPagination } from "@/components/utils/SmartPagination";
import RefreshButton from "@/components/utils/RefreshButton";

interface Payment {
  id: number;
  invoice: string;
  payment_method: string;
  member: string;
  payment_gateway: string;
  payment_date: string;
  payment_status: string;
  payment_amount: string;
  is_active: boolean;
  transaction: string;
  processed_by: string;
}

interface Props {
  payments: Payment[];
}

export default function PaymentTable({ payments }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pagination
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 10;

  // Filters
  const filterMember = searchParams.get("member") || "";
  const filterMethod = searchParams.get("payment_method") || "all";
  const filterStatus = searchParams.get("payment_status") || "all";

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    if (
      filterMember &&
      !p.member.toLowerCase().includes(filterMember.toLowerCase())
    )
      return false;
    if (filterMethod !== "all" && p.payment_method !== filterMethod)
      return false;
    if (filterStatus !== "all" && p.payment_status !== filterStatus)
      return false;
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const currentPage = pageParam > totalPages ? 1 : pageParam;
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Construct pagination data for SmartPagination
  const paginationData = {
    count: filteredPayments.length,
    total_pages: totalPages,
    current_page: currentPage,
    next: currentPage < totalPages ? "next" : null,
    previous: currentPage > 1 ? "prev" : null,
    page_size: itemsPerPage,
  };

  return (
    <div>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-row items-center gap-2">
          <CardTitle className="text-xl font-bold opacity-75">
            All Payments
          </CardTitle>
        </div>

       <div className="flex flex-row items-center gap-2">
         <PaymentSearchFilterSection
          filterOptions={{
            members: Array.from(new Set(payments.map((p) => p.member))),
            payment_methods: Array.from(
              new Set(payments.map((p) => p.payment_method))
            ),
            statuses: ["paid", "unpaid", "partial_paid"],
          }}
        />
        <RefreshButton />
       </div>
      </CardHeader>

      <CardContent>
        <Table className="w-full text-sm text-gray-700 dark:text-gray-400">
          <TableHeader className="bg-gray-100 dark:bg-gray-700">
            <TableRow className="bg-gray-150 font-bold text-sm">
              <TableHead>ID</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Is Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedPayments?.map((p: Payment) => (
              <TableRow
                key={p.id}
                className="hover:bg-indigo-50 transition-all duration-200"
              >
                <TableCell>{p.id}</TableCell>
                <TableCell className="font-medium">{p.invoice}</TableCell>
                <TableCell>{p.member}</TableCell>
                <TableCell>{p.payment_method}</TableCell>
                <TableCell className="font-medium">{p.payment_amount}</TableCell>
                <TableCell className="font-medium">{p.transaction}</TableCell>
                <TableCell>{p.payment_date}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.payment_status === "paid"
                        ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                        : p.payment_status === "unpaid"
                        ? "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        : "bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                    }`}
                  >
                    {p.payment_status.charAt(0).toUpperCase() + p.payment_status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                        className={
                          p.is_active
                            ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors"
                            : "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors"
                        }
                      >
                        {p.is_active ? "Active" : "Inactive"}
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
                          href={`/mfm/payments/${p.id}`}
                          className="flex items-center text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 hover:bg-red-100 cursor-pointer"
                        onClick={() => {
                          // setSelectedTransaction(t);
                          // setDeleteDialogOpen(true);
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

        {/* Smart Pagination */}
        <SmartPagination paginationData={paginationData} className="mt-4" />
      </CardContent>
    </div>
  );
}
