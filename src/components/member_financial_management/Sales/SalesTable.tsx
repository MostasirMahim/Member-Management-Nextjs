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

import { SalesSearchFilterSection } from "./SalesSearchFilterSection";
import SalesDeleteDialog from "./SalesDeleteDialog";


interface Sale {
  id: number;
  sale_number: string;
  sale_source_type: string;
  customer: string;
  payment_method: string;
  payment_status: "paid" | "unpaid" | "partial_paid";
  invoice: string;
  sales_date: string;
  due_date?: string;
  total_amount: string;
  sub_total: string;
  is_active: boolean;
}

interface SalesResponse {
  code: number;
  message: string;
  status: string;
  data: Sale[];
}

interface Props {
  sales: SalesResponse;
}

export default function SalesTable({ sales }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Pagination
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 10;

  // Filters from URL
  const filterCustomer = searchParams.get("customer") || "";
  const filterType = searchParams.get("sale_source_type") || "all";
  const filterStatus = searchParams.get("payment_status") || "all";

  // Filter sales
  const filteredSales = sales?.data?.filter((s) => {
    if (
      filterCustomer &&
      !s.customer.toLowerCase().includes(filterCustomer.toLowerCase())
    )
      return false;
    if (filterType !== "all" && s.sale_source_type !== filterType) return false;
    if (filterStatus !== "all" && s.payment_status !== filterStatus)
      return false;
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredSales?.length / itemsPerPage);
  const currentPage = pageParam > totalPages ? 1 : pageParam;
  const paginatedSales = filteredSales?.slice(
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
      {/* Header + Filters */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-row items-center gap-2">
          <CardTitle className="text-xl font-bold opacity-75">
            All Sales
          </CardTitle>
        </div>

        <SalesSearchFilterSection
          filterOptions={{
            sale_source_types: Array.from(
              new Set(sales.data.map((s) => s.sale_source_type))
            ),
            customers: Array.from(new Set(sales.data.map((s) => s.customer))),
            statuses: ["paid", "unpaid", "partial_paid"],
          }}
        />
      </CardHeader>

      {/* Table */}
      <CardContent>
        <Table className="w-full text-sm text-gray-700">
          <TableHeader className="bg-gray-100">
            <TableRow className="bg-gray-150 font-bold text-sm">
              <TableHead>ID</TableHead>
              <TableHead>Sale No</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Sales Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>
                Sub Total
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Is Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedSales.map((s) => (
              <TableRow
                key={s.id}
                className="hover:bg-indigo-50 transition-all duration-200"
              >
                <TableCell>{s.id}</TableCell>
                <TableCell className="font-medium">{s.sale_number}</TableCell>
                <TableCell className="font-medium">{s.invoice}</TableCell>
                <TableCell>{s.customer}</TableCell>
                <TableCell>{s.sale_source_type}</TableCell>
                <TableCell>{s.sales_date}</TableCell>
                <TableCell>{s.due_date || "-"}</TableCell>
                <TableCell className="font-medium">{s.total_amount}</TableCell>
                <TableCell className="font-medium">{s.sub_total}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      s.payment_status === "paid"
                        ? "bg-green-600 text-white"
                        : s.payment_status === "unpaid"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    }
                  >
                    {s.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      s.is_active
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {s.is_active ? "active" : "inactive"}
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
                      {/* View Sale */}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/mfm/sales/${s.id}`}
                          className="flex items-center text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                      </DropdownMenuItem>
                      {/* Delete Sale */}
                      <DropdownMenuItem
                        className="text-red-600 hover:bg-red-100 cursor-pointer"
                        onClick={() => {
                          setSelectedSale(s);
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

        {/* Pagination */}
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

      {/* Delete Confirmation Dialog */}
      {/* {selectedSale && (
        <SalesDeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          saleId={selectedSale.id}
        />
      )} */}
    </div>
  );
}
