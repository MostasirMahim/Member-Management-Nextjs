"use client";
import { useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/store/cartStore";
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
export default function InvoicePage({ member_ids = [] }: InvoiceProps) {
  const cart = useCartStore((state) => state.cart);

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

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const router = useRouter();

  // Totals
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = parseFloat(
  cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  .toFixed(2)
);


  // Delete product from cart
  const handleDeleteProduct = (id: number) => {
    useCartStore.setState({
      cart: cart.filter((item) => item.id !== id),
    });
  };

  // Generate invoice
  const handleGenerateInvoice = async () => {
  if (!selectedMember) return toast.error("Please select a member");
  if (!cart.length) return toast.error("Cart is empty");

  const payload = {
    member_ID: selectedMember,
    product_items: cart.map((p) => ({ product: p.id, quantity: p.quantity })),
    promo_code: promoCode || undefined,
  };

  try {
    await axiosInstance.post("/api/product/v1/products/buy/", payload);
    toast.success("Invoice generated successfully!");
    useCartStore.setState({ cart: [] });
    router.refresh();

  } catch (error: any) {
    console.error("Invoice generation error:", error);

    if (error?.response?.data?.errors) {
      // errors object থেকে readable string বানানো
      const errorMessages = Object.values(error.response.data.errors)
        .flat()
        .join(", ");
      toast.error(errorMessages);
    } else {
      toast.error(error?.response?.data?.message || "Invoice generation failed");
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
              disabled={currentPage === 1}
            />
            <PaginationContent>
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    active={page === currentPage}
                  >
                    <PaginationLink>{page}</PaginationLink>
                  </PaginationItem>
                );
              })}
            </PaginationContent>
            <PaginationNext
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
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
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(item.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between font-semibold mt-3">
            <span>Total Quantity: {totalQuantity}</span>
            <span>Total Price: ${totalPrice}</span>
          </div>

          <Input
            placeholder="Promo Code (Optional)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="mt-3"
          />

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
