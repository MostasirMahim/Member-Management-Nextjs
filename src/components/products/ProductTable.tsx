
"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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
import {
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Package,
} from "lucide-react";
import { SearchFilterSection } from "@/components/products/SearchFilterSection";
import Link from "next/link";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedBrand = searchParams.get("brand") || "all";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const itemsPerPage = 10;

  // Filter products
  const filteredProducts = products?.data?.filter((p) => {
    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (selectedCategory !== "all" && p.category !== selectedCategory)
      return false;
    if (selectedBrand !== "all" && p.brand !== selectedBrand) return false;
    return true;
  });

  // Pagination calc
  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);

  // currentPage validate
  const currentPage = pageParam > totalPages ? 1 : pageParam;

  // Slice data for current page
  const paginatedProducts = filteredProducts?.slice(
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
    <Card className="shadow-md border rounded-2xl bg-white">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-row items-center gap-2">
          <Package className="h-6 w-6 opacity-75" />
          <CardTitle className="text-xl font-bold opacity-75">
            All Products
          </CardTitle>
        </div>

        {/* Filter & Search Section */}
        <SearchFilterSection
          filterOptions={{
            categories: Array.from(
              new Set(products?.data?.map((p) => p.category))
            ),
            brands: Array.from(new Set(products?.data?.map((p) => p.brand))),
          }}
        />
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
              <TableHead className="text-right text-gray-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((prod) => (
              <TableRow
                key={prod.id}
                className="hover:bg-indigo-50 transition-all duration-200"
              >
                <TableCell>
                  <Image
                    src={`http://127.0.0.1:8000/${prod.media[0]?.image}` || "/placeholder.png"}
                    alt={prod.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-md object-cover border"
                  />
                </TableCell>

                <TableCell className="font-semibold text-gray-900">
                  {prod.name}
                </TableCell>

                <TableCell className="font-medium text-gray-800">
                  ${prod.price}
                </TableCell>

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

                <TableCell>
                  {prod.quantity_in_stock > 0 ? (
                    <Badge className="bg-green-500 text-white">
                      {prod.quantity_in_stock} in stock
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500 text-white">Out of stock</Badge>
                  )}
                </TableCell>

                <TableCell className="text-gray-600">{prod.sku}</TableCell>

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

                <TableCell>{prod.category}</TableCell>

                <TableCell>{prod.brand}</TableCell>

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

        {/* Pagination */}
        <Pagination className="mt-4 justify-center flex">
          <PaginationPrevious
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          />
          <PaginationContent>
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <PaginationItem
                  key={page}
                  onClick={() => goToPage(page)}
                  active={page === currentPage}
                >
                  <PaginationLink>{page}</PaginationLink>
                </PaginationItem>
              );
            })}
          </PaginationContent>
          <PaginationNext
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </CardContent>
    </Card>
  );
}
