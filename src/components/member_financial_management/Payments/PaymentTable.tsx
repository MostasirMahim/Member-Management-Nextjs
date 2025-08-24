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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

import { PaymentSearchFilterSection } from "./PaymentSearchFilterSection";

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
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-row items-center gap-2">
          <CardTitle className="text-xl font-bold opacity-75">
            All Transactions
          </CardTitle>
        </div>

        <PaymentSearchFilterSection
          filterOptions={{
            members: Array.from(new Set(payments.map((p) => p.member))),
            payment_methods: Array.from(new Set(payments.map((p) => p.payment_method))),
            statuses: ["paid", "unpaid", "partial_paid"],
          }}
        />
      </CardHeader>

      <CardContent>
        <Table className="w-full text-sm text-gray-700">
          <TableHeader className="bg-gray-100">
            <TableRow className="bg-gray-150 font-bold text-sm">
              <TableHead>ID</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Member</TableHead>
              <TableHead> Method</TableHead>
              <TableHead> Amount</TableHead>
              <TableHead> Transaction</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Is Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedPayments?.map((p: any) => (
              <TableRow
                key={p.id}
                className="hover:bg-indigo-50 transition-all duration-200"
              >
                <TableCell>{p.id}</TableCell>
                <TableCell className="font-medium">{p.invoice}</TableCell>
                <TableCell>{p.member}</TableCell>
                <TableCell>{p.payment_method}</TableCell>
                <TableCell className="font-medium">
                  {p.payment_amount}
                </TableCell>
                <TableCell className="font-medium">{p.transaction}</TableCell>
                <TableCell>{p.payment_date}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      p.payment_status === "paid"
                        ? "bg-green-600 text-white"
                        : p.payment_status === "unpaid"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    }
                  >
                    {p.payment_status || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      p.is_active
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {p.is_active ? "active" : "inactive"}
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
                          //   setSelectedTransaction(t);
                          //   setDeleteDialogOpen(true);
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

        <Pagination className="mt-4 justify-center flex cursor-pointer">
                  <PaginationPrevious onClick={() => goToPage(currentPage - 1)} />
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
                  <PaginationNext onClick={() => goToPage(currentPage + 1)} />
        </Pagination>
      </CardContent>
    </div>
  );
}
