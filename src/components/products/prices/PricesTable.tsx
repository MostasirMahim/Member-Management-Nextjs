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
import EditPriceModal from "@/components/products/prices/EditPriceModal";
import DeletePriceDialog from "@/components/products/prices/DeletePriceDialog";

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
    <Card className="shadow-md border rounded-2xl bg-white">
      <CardHeader className="flex flex-row items-center gap-2">
        <Layers className="h-6 w-6 opacity-75" />
        <CardTitle className="text-xl font-bold opacity-75">
          All Product Prices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full text-sm text-gray-700">
          <TableHeader className="bg-gray-100">
            <TableRow className="bg-gray-100 font-extrabold text-sm">
              <TableHead className="w-10 text-gray-600">Id</TableHead>
              <TableHead className="text-gray-600">Product Name</TableHead>
              <TableHead className="text-gray-600">Product SKU</TableHead>
              <TableHead className="text-gray-600">Membership Type</TableHead>
              <TableHead className="text-gray-600">Price</TableHead>
              <TableHead className="text-gray-600">Is Active</TableHead>
              <TableHead className="text-gray-600">Created At</TableHead>
              <TableHead className="text-gray-600">Updated At</TableHead>
              <TableHead className="text-right text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productPrices?.data?.map((price) => (
              <TableRow
                key={price.id}
                className="hover:bg-indigo-50 transition-all duration-200"
              >
                <TableCell className="font-medium text-gray-700">
                  {price.id}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {price.product.name}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {price.product.sku}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {price.membership_type.name}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {price.price} ৳
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
                <TableCell className="font-semibold text-gray-900">
                  {formatBDTime(price.created_at)}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {formatBDTime(price.updated_at)}
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
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPrice(price);
                          setEditModalOpen(true);
                        }}
                        className="text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600 hover:bg-red-100 cursor-pointer"
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

      {/* Edit Modal */}
      {/* {selectedPrice && (
        <EditPriceModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          price={selectedPrice}
        />
      )} */}

      {/* Delete Dialog */}
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
