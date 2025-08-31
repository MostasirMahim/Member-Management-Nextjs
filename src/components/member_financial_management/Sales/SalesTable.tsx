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

import { SalesSearchFilterSection } from "./SalesSearchFilterSection";
import SalesDeleteDialog from "./SalesDeleteDialog";
import { SmartPagination } from "@/components/utils/SmartPagination"; 

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

  // Build pagination data for SmartPagination
  const paginationData = {
    count: filteredSales.length,
    total_pages: totalPages,
    current_page: currentPage,
    next: currentPage < totalPages ? (currentPage + 1).toString() : null,
    previous: currentPage > 1 ? (currentPage - 1).toString() : null,
    page_size: itemsPerPage,
  };

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
        <Table className="w-full text-sm text-gray-700 dark:text-gray-500 ">
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
              <TableHead>Sub Total</TableHead>
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
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      s.payment_status === "paid"
                        ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                        : s.payment_status === "unpaid"
                        ? "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        : "bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                    }`}
                  >
                    {s.payment_status.charAt(0).toUpperCase() + s.payment_status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                        className={
                          s.is_active
                            ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors"
                            : "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors"
                        }
                      >
                        {s.is_active ? "Active" : "Inactive"}
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

        {/* Smart Pagination */}
        <SmartPagination paginationData={paginationData} />
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
