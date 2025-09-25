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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";

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

  // Filtered & paginated members
  const filteredMembers = useMemo(() => {
    return member_ids.filter((id) =>
      id.toLowerCase().includes(searchMember.toLowerCase())
    );
  }, [member_ids, searchMember]);

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const router = useRouter();

  // Totals
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = parseFloat(
    cart
      .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
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
        toast.error(
          error?.response?.data?.message || "Invoice generation failed"
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buy Products</h1>
        <p className="text-muted-foreground">
          Select a member and generate product purchase invoice.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section: Member selection */}
        <div className="flex-1 flex flex-col space-y-2 shadow-lg rounded-xl p-4 dark:bg-muted border">
          <h2 className="text-lg font-semibold mb-2">Select Member ID</h2>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search Members..."
                  className="pl-10 bg-background focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="h-[250px] sm:h-[300px] border rounded-md p-3 sm:p-4">
              <div className="space-y-2 sm:space-y-3">
                {filteredMembers?.map((ids: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded"
                  >
                    <Checkbox
                      id={ids}
                      checked={selectedMember === ids}
                      onCheckedChange={(checked) =>
                        setSelectedMember(checked ? ids : null)
                      }
                    />
                    <Label
                      htmlFor={ids}
                      className="text-xs sm:text-sm font-mono cursor-pointer flex-1 leading-tight"
                    >
                      {ids}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Right Section: Cart summary */}
        <Card className="flex-1 shadow-md border rounded-2xl">
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Table className="w-full text-sm ">
              <TableHeader className="bg-muted">
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
              variant="default"
              className="mt-5 w-full"
              onClick={handleGenerateInvoice}
            >
              Generate Invoice
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
