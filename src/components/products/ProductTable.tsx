"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Pencil, Trash2, Eye, Package } from "lucide-react";

import Link from "next/link";

interface Media {
  id: number;
  image: string;
  is_active: boolean;
}


interface Product {
  id: number;
  media: Media[];
  category: string;
  brand: string;
  name: string;
  description: string;
  price: string;
  discount_rate: string;
  quantity_in_stock: number;
  sku: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductResponse {
  code: number;
  message: string;
  status: string;
  data: Product[];
}

interface Props {
  products: ProductResponse;
}

export default function ProductTable({ products }: Props) {
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const formatBDTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Card className="shadow-md border rounded-2xl bg-white">
      <CardHeader className="flex flex-row items-center gap-2">
        <Package className="h-6 w-6 opacity-75" />
        <CardTitle className="text-xl font-bold opacity-75">
          All Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full text-sm text-gray-700">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-gray-500">Image</TableHead>
              <TableHead className="text-gray-600">Name</TableHead>
              <TableHead className="text-gray-600">Price</TableHead>
              <TableHead className="text-gray-600">Discount</TableHead>
              <TableHead className="text-gray-600">Stock</TableHead>
              <TableHead className="text-gray-600">SKU</TableHead>
              <TableHead className="text-gray-600">Status</TableHead>
              <TableHead className="text-gray-600">Category</TableHead>
              <TableHead className="text-gray-600">Brand</TableHead>
              <TableHead className="text-right text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.data?.map((prod) => (
              <TableRow
                key={prod.id}
                className="hover:bg-indigo-50 transition-all duration-200"
              >
                {/* Product Image */}
                {/* <TableCell className="flex gap-2">
                    {prod.media && prod.media.length > 0 ? (
                        prod.media.map((m) => (
                        <img
                            key={m.id}
                            src={m.image }
                            alt={prod.name}
                            className="w-14 h-14 rounded-md object-cover border"
                        />
                        ))
                    ) : (
                        <img
                        src="/placeholder.png"
                        alt="No image"
                        className="w-14 h-14 rounded-md object-cover border"
                        />
                    )}
                </TableCell> */}
                <TableCell>
                  <img
                    src={prod.media[0]?.image || "/placeholder.png"}
                    alt={prod.name}
                    className="w-14 h-14 rounded-md object-cover border"
                  />
                </TableCell>

                {/* Name */}
                <TableCell className="font-semibold text-gray-900">
                  {prod.name}
                </TableCell>

                {/* Price */}
                <TableCell className="font-medium text-gray-800">
                  ${prod.price}
                </TableCell>

                {/* Discount */}
                <TableCell>
                  {parseFloat(prod.discount_rate) > 0 ? (
                    <Badge className="bg-yellow-500 text-white">
                      {prod.discount_rate}%
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-300 text-gray-700">
                      No Discount
                    </Badge>
                  )}
                </TableCell>

                {/* Stock */}
                <TableCell>
                  {prod.quantity_in_stock > 0 ? (
                    <Badge className="bg-green-500 text-white">
                      {prod.quantity_in_stock} in stock
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500 text-white">
                      Out of stock
                    </Badge>
                  )}
                </TableCell>

                {/* SKU */}
                <TableCell className="text-gray-600">{prod.sku}</TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    className={
                      prod.is_active
                        ? "bg-green-600 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {prod.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                {/* Category */}
                <TableCell>
                    {prod.category}
                </TableCell>

                {/* Brand */}
                <TableCell>
                    {prod.brand}
                </TableCell>

                {/* Actions */}
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
                      <DropdownMenuItem asChild>
                        <Link
                            href={`/products/${prod.id}`} 
                            className="flex items-center text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                        >
                            <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                    </DropdownMenuItem>
                      <DropdownMenuItem className="text-indigo-600 hover:bg-indigo-100 cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 hover:bg-red-100 cursor-pointer">
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
    </Card>
  );
}
