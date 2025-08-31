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
    <div className="space-y-4">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-2">
        <Layers className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
          All Product Prices
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table className="w-full text-sm text-gray-700 dark:text-gray-300">
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            <TableRow className="font-extrabold text-sm">
              <TableHead className="w-10 text-gray-600 dark:text-gray-400">ID</TableHead>
              <TableHead className="text-gray-600 dark:text-gray-400">Product Name</TableHead>
              <TableHead className="text-gray-600 dark:text-gray-400">Product SKU</TableHead>
              <TableHead className="text-gray-600 dark:text-gray-400">Membership Type</TableHead>
              <TableHead className="text-gray-600 dark:text-gray-400">Price</TableHead>
              <TableHead className="text-gray-600 dark:text-gray-400">Is Active</TableHead>
              <TableHead className="text-gray-600 dark:text-gray-400">Created At</TableHead>
              <TableHead className="text-gray-600 dark:text-gray-400">Updated At</TableHead>
              <TableHead className="text-right text-gray-500 dark:text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {productPrices?.data?.map((price) => (
              <TableRow
                key={price.id}
                className="hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors duration-200"
              >
                <TableCell className="font-medium text-gray-700 dark:text-gray-300">{price.id}</TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{price.product.name}</TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{price.product.sku}</TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{price.membership_type.name}</TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{price.price} $</TableCell>
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
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{formatBDTime(price.created_at)}</TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{formatBDTime(price.updated_at)}</TableCell>
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
                    <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPrice(price);
                          setEditModalOpen(true);
                        }}
                        className="text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-800 cursor-pointer"
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
    </div>
  );
}
