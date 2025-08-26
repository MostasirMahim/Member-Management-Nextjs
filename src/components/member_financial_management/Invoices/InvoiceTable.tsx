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
import { MoreVertical, Eye, Trash2, Pencil,DollarSign } from "lucide-react";
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
import { toast } from "react-toastify";

import { InvoiceSearchFilterSection } from "./InvoiceSearchFilterSection";
import InvoiceDeleteDialog from "./InvoiceDeleteDialog";
import InvoiceEditModal from "./InvoiceEditModal";
import PaymentInvoice from "./Payment/Invoice/PaymentInvoice";

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
  const [paymentInvoiceOpen, setPaymentInvoiceOpen] = useState(false);

  // Pagination
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 10;

  // Filters from URL
  const filterMember = searchParams.get("member") || "";
  const filterType = searchParams.get("invoice_type") || "all";
  const filterStatus = searchParams.get("status") || "all";
  const filterFullPaid = searchParams.get("is_full_paid") || "all";

  // Filter invoices
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredInvoices?.length / itemsPerPage);
  const currentPage = pageParam > totalPages ? 1 : pageParam;
  const paginatedInvoices = filteredInvoices?.slice(
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
            All Invoices
          </CardTitle>
        </div>

        <InvoiceSearchFilterSection
          filterOptions={{
            invoice_types: Array.from(
              new Set(invoices.data.map((i) => i.invoice_type))
            ),
            members: Array.from(new Set(invoices.data.map((i) => i.member))),
            statuses: ["paid", "unpaid", "partial_paid", "due"],
          }}
        />
      </CardHeader>

      {/* Table */}
      <CardContent>
        <Table className="w-full text-sm text-gray-700">
          <TableHeader className="bg-gray-100">
            <TableRow className="bg-gray-150 font-bold text-sm">
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
                className="hover:bg-indigo-50 transition-all duration-200"
              >
                <TableCell>{inv.id}</TableCell>
                <TableCell className="font-medium">
                  {inv.invoice_number}
                </TableCell>
                <TableCell>{inv.invoice_type}</TableCell>
                <TableCell>{inv.member}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {inv.issue_date}
                </TableCell>
                <TableCell className="font-medium">
                  {inv.total_amount} {inv.currency}
                </TableCell>
                <TableCell className="font-medium">
                  {inv.paid_amount} {inv.currency}
                </TableCell>
                <TableCell className="font-medium">
                  {inv.balance_due} {inv.currency}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      inv.status === "paid"
                        ? "bg-green-600 text-white"
                        : inv.status === "unpaid"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    }
                  >
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      inv.is_active
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {inv.is_active ? "active" : "inactive"}
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
                      {/* View Invoice */}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/mfm/invoices/${inv.id}`}
                          className="flex items-center text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                      </DropdownMenuItem>
                      {/* Delete Invoice */}
                      <DropdownMenuItem
                        className="text-red-600 hover:bg-red-100 cursor-pointer"
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                      {/* Edit Invoice */}
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setEditModalOpen(true);
                        }}
                        className="text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      {/* Payment Invoice */}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/mfm/payment_invoice?id=${inv.id}`}
                          className="flex items-center text-sky-600 hover:bg-indigo-100 cursor-pointer"
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
      {/* Payment Invoice Modal */}
    </div>
  );
}
