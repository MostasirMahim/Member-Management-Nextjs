"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { MoreVertical, Pencil, Trash2, Layers } from "lucide-react";
import { usePathname } from "next/navigation";
import RefreshButton from "@/components/utils/RefreshButton";

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface MembershipType {
  id: number;
  name: string;
}

interface ProductPrice {
  id: number;
  price: string;
  product: Product;
  membership_type: MembershipType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductPriceResponse {
  code: number;
  message: string;
  status: string;
  data: ProductPrice[];
  pagination?: any;
}

interface Props {
  productPrices: ProductPriceResponse;
}

export default function ProductPricesTable({ productPrices }: Props) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<ProductPrice | null>(null);
  const pathname = usePathname();

  const formatBDTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card >
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-2">
        <CardTitle className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6" />
            <span className="text-2xl font-bold">Price List</span>
          </div>
          <RefreshButton />
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table className="w-full text-sm">
          <TableHeader >
            <TableRow className="font-extrabold text-sm">
              <TableHead className="w-10">
                ID
              </TableHead>
              <TableHead >
                Product Name
              </TableHead>
              <TableHead >
                Product SKU
              </TableHead>
              <TableHead >
                Membership Type
              </TableHead>
              <TableHead >
                Price
              </TableHead>
              <TableHead >
                Is Active
              </TableHead>
              <TableHead >
                Created At
              </TableHead>
              <TableHead >
                Updated At
              </TableHead>
              <TableHead className="text-right ">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {productPrices?.data?.map((price) => (
              <TableRow
                key={price.id}
              >
                <TableCell className="font-medium ">
                  {price.id}
                </TableCell>
                <TableCell className="font-semibold ">
                  {price.product.name}
                </TableCell>
                <TableCell className="font-semibold ">
                  {price.product.sku}
                </TableCell>
                <TableCell className="font-semibold ">
                  {price.membership_type.name}
                </TableCell>
                <TableCell className="font-semibold ">
                  {price.price} $
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      price.is_active
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {price.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold ">
                  {formatBDTime(price.created_at)}
                </TableCell>
                <TableCell className="font-semibold ">
                  {formatBDTime(price.updated_at)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white dark:bg-gray-900"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPrice(price);
                          setEditModalOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600 hover:bg-red-100 dark:hover:bg-red-800 cursor-pointer"
                        onClick={() => {
                          setSelectedPrice(price);
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
      </CardContent>

      {/* Modals */}
      {/* {selectedPrice && (
        <EditPriceModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          price={selectedPrice}
        />
      )} */}

      {/* {selectedPrice && (
        <DeletePriceDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          priceId={selectedPrice.id}
        />
      )} */}
    </Card>
  );
}
