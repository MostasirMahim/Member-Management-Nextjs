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
import { MoreVertical, Eye, Trash2, Pencil, DollarSign } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { InvoiceSearchFilterSection } from "./InvoiceSearchFilterSection";
import InvoiceDeleteDialog from "./InvoiceDeleteDialog";
import InvoiceEditModal from "./InvoiceEditModal";
import { SmartPagination } from "@/components/utils/SmartPagination";
import RefreshButton from "@/components/utils/RefreshButton";

interface Invoice {
  id: number;
  invoice_number: string;
  invoice_type: string;
  generated_by: string;
  member: string;
  restaurant?: string;
  event?: string;
  issue_date: string;
  due_date?: string;
  total_amount: string;
  paid_amount: string;
  balance_due: string;
  status: "paid" | "unpaid" | "partial_paid" | "due";
  currency: string;
  is_full_paid: boolean;
  is_active: boolean;
}

interface InvoiceResponse {
  code: number;
  message: string;
  status: string;
  data: Invoice[];
}

interface Props {
  invoices: InvoiceResponse;
}

export default function InvoiceTable({ invoices }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 10;

  const filterMember = searchParams.get("member") || "";
  const filterType = searchParams.get("invoice_type") || "all";
  const filterStatus = searchParams.get("status") || "all";
  const filterFullPaid = searchParams.get("is_full_paid") || "all";

  const filteredInvoices = invoices?.data?.filter((inv) => {
    if (
      filterMember &&
      !inv.member.toLowerCase().includes(filterMember.toLowerCase())
    )
      return false;
    if (filterType !== "all" && !inv.invoice_type.includes(filterType))
      return false;
    if (filterStatus !== "all" && inv.status !== filterStatus) return false;
    if (filterFullPaid !== "all") {
      const isPaid = filterFullPaid === "true";
      if (inv.is_full_paid !== isPaid) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredInvoices?.length / itemsPerPage);
  const currentPage = pageParam > totalPages ? 1 : pageParam;

  const paginatedInvoices = filteredInvoices?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginationData = {
    count: filteredInvoices?.length || 0,
    total_pages: totalPages,
    current_page: currentPage,
    next: currentPage < totalPages ? "next" : null,
    previous: currentPage > 1 ? "prev" : null,
    page_size: itemsPerPage,
  };
  return (
    <Card>
      {/* Header + Filters */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-row items-center gap-2">
          <CardTitle className="text-xl font-bold opacity-75">
            All Invoices
          </CardTitle>
        </div>

      <div className="flex items-center gap-2">
          <InvoiceSearchFilterSection
          filterOptions={{
            invoice_types: Array.from(
              new Set(invoices.data.map((i) => i.invoice_type))
            ),
            members: Array.from(new Set(invoices.data.map((i) => i.member))),
            statuses: ["paid", "unpaid", "partial_paid", "due"],
          }}
        />
        <RefreshButton />
      </div>
      </CardHeader>

      {/* Table */}
      <CardContent className=" ">
        <Table className="w-full text-sm text-gray-800 dark:text-gray-200">
          <TableHeader>
            <TableRow className="  font-bold text-sm ">
              <TableHead>ID</TableHead>
              <TableHead>Invoice No</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Member</TableHead>
              <TableHead className="hidden md:table-cell">Issue Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Balance Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Is Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedInvoices.map((inv) => (
              <TableRow
                key={inv.id}
                className="hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-all duration-200"
              >
                <TableCell>{inv.id}</TableCell>
                <TableCell className="font-medium">{inv.invoice_number}</TableCell>
                <TableCell>{inv.invoice_type}</TableCell>
                <TableCell>{inv.member}</TableCell>
                <TableCell className="hidden md:table-cell">{inv.issue_date}</TableCell>
                <TableCell className="font-medium">{inv.total_amount} {inv.currency}</TableCell>
                <TableCell className="font-medium">{inv.paid_amount} {inv.currency}</TableCell>
                <TableCell className="font-medium">{inv.balance_due} {inv.currency}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      inv.status === "paid"
                        ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                        : inv.status === "unpaid"
                        ? "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        : "bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                    }`}
                  >
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      inv.is_active
                        ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                        : "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    }`}
                  >
                    {inv.is_active ? "Active" : "Inactive"}
                  </span>
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
                    <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:text-gray-200">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/mfm/invoices/${inv.id}`}
                          className="flex items-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 cursor-pointer"
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setEditModalOpen(true);
                        }}
                        className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/mfm/payment_invoice?id=${inv.id}`}
                          className="flex items-center text-sky-600 dark:text-sky-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer"
                        >
                          <DollarSign className="mr-2 h-4 w-4" /> Payment Invoice
                        </Link>
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

      {/* Delete Confirmation Dialog */}
      {selectedInvoice && (
        <InvoiceDeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          invoiceId={selectedInvoice.id}
        />
      )}

      {/* Edit Invoice Modal */}
      {selectedInvoice && (
        <InvoiceEditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          invoice={selectedInvoice}
        />
      )}
    </Card>
  );
}
