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
import { MembersList } from "../events/MembersList";
import { ScrollArea } from "../ui/scroll-area";
import { Label } from "../ui/label";
import { Search } from "lucide-react";

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

  // Filtered & paginated members
  const filteredMembers = useMemo(() => {
    return member_ids.filter((id) =>
      id.toLowerCase().includes(searchMember.toLowerCase())
    );
  }, [member_ids, searchMember]);

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buy Facility</h1>
        <p className="text-muted-foreground">
          Select a member and generate facility usage invoice.
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
        <Card className="flex-1 shadow-md border rounded-2xl ">
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Table className="w-full text-sm ">
              <TableHeader className="bg-muted">
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
