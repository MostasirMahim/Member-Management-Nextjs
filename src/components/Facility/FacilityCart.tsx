"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useFacilityCartStore } from "@/store/cartStore";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axiosInstance from "@/lib/axiosInstance";

// ---------------- Props ----------------
interface InvoiceProps {
  member_ids?: string[]; // ensure optional and array
}

// ---------------- Component ----------------
export default function FacilityCart({ member_ids = [] }: InvoiceProps) {
  const cart = useFacilityCartStore((state) => state.facility);
  const clearCart = useFacilityCartStore((state) => state.clearFacility);

  // Member selection state
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [searchMember, setSearchMember] = useState("");

  // Pagination state
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered & paginated members
  const filteredMembers = useMemo(() => {
    return member_ids.filter((id) =>
      id.toLowerCase().includes(searchMember.toLowerCase())
    );
  }, [member_ids, searchMember]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const router = useRouter();

  // Delete product from cart
  const handleDeleteProduct = () => {
    clearCart();
  };

  // Generate invoice
  const handleGenerateInvoice = async () => {
    if (!selectedMember) return toast.error("Please select a member");
    if (!cart) return toast.error("Cart is empty");

    try {
      const response = await axiosInstance.post(
        "/api/facility/v1/facility/buy/",
        {
          member_ID: selectedMember,
          facility: cart.id,
        }
      );
      if (response.status == 200) {
        toast.success("Invoice generated successfully!");
        router.push("/mfm/invoices");
      }
    } catch (error: any) {
      console.error("Invoice generation error:", error);

      if (error?.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        toast.error(errorMessages);
      } else {
        toast.error(
          error?.response?.data?.message || "Invoice generation failed"
        );
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Section: Member selection */}
      <Card className="flex-1 shadow-md border rounded-2xl bg-white">
        <CardHeader>
          <CardTitle>Select Member</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search member ID"
            value={searchMember}
            onChange={(e) => setSearchMember(e.target.value)}
            className="mb-3"
          />
          <Table className="w-full text-sm text-gray-700">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Member ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMembers.map((id) => (
                <TableRow key={id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedMember === id}
                      onCheckedChange={() => setSelectedMember(id)}
                    />
                  </TableCell>
                  <TableCell>{id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination className="mt-4 justify-center flex cursor-pointer">
            <PaginationPrevious
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            />
            <PaginationContent>
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem
                    key={page}
                    onClick={() => setCurrentPage(page)}
                  >
                    <PaginationLink isActive={page === currentPage}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            </PaginationContent>
            <PaginationNext
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            />
          </Pagination>
        </CardContent>
      </Card>

      {/* Right Section: Cart summary */}
      <Card className="flex-1 shadow-md border rounded-2xl bg-white">
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Table className="w-full text-sm text-gray-700">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Facility Name</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow key={cart.id}>
                <TableCell>{cart.name}</TableCell>
                <TableCell>${cart.usages_fee}</TableCell>
                <TableCell>{cart.capacity}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct()}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Button
            className="mt-5 w-full bg-blue-500 text-white"
            onClick={handleGenerateInvoice}
          >
            Generate Invoice
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
