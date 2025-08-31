"use client";

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
import { MoreVertical, Pencil, Trash2, Eye, Package } from "lucide-react";
import { SearchFilterSection } from "@/components/products/SearchFilterSection";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { SmartPagination } from "@/components/utils/SmartPagination"; 

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
  const currentPage = pageParam > totalPages ? 1 : pageParam;

  // Slice data for current page
  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Prepare paginationData for SmartPagination
  const paginationData = {
    count: filteredProducts?.length || 0,
    total_pages: totalPages,
    current_page: currentPage,
    next: currentPage < totalPages ? `?page=${currentPage + 1}` : null,
    previous: currentPage > 1 ? `?page=${currentPage - 1}` : null,
    page_size: itemsPerPage,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r rounded-t-2xl py-6 px-4 ">
          <div className="flex flex-row items-center gap-2">
            <Package className="h-7 w-7 text-indigo-600" />
            <CardTitle className="text-xl md:text-2xl font-bold text-indigo-600 tracking-tight drop-shadow ">
              Product Inventory
            </CardTitle>
          </div>
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
          <div className="overflow-x-auto">
            <Table className="min-w-[1100px] text-sm">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-indigo-100 via-blue-200 to-indigo-200">
                  <TableHead className="text-gray-700 font-bold text-base py-4">
                    Image
                  </TableHead>
                  <TableHead className="text-yellow-700 font-bold text-base py-4">
                    Name
                  </TableHead>
                  <TableHead className="text-green-700 font-bold text-base py-4">
                    Price
                  </TableHead>
                  <TableHead className="text-yellow-700 font-bold text-base py-4">
                    Discount
                  </TableHead>
                  <TableHead className="text-green-700 font-bold text-base py-4">
                    Stock
                  </TableHead>
                  <TableHead className="text-indigo-700 font-bold text-base py-4">
                    SKU
                  </TableHead>
                  <TableHead className="text-green-700 font-bold text-base py-4">
                    Status
                  </TableHead>
                  <TableHead className="text-blue-700 font-bold text-base py-4">
                    Category
                  </TableHead>
                  <TableHead className="text-purple-700 font-bold text-base py-4">
                    Brand
                  </TableHead>
                  <TableHead className="text-gray-700 font-bold text-base py-4 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts?.map((prod) => (
                  <TableRow
                    key={prod.id}
                    className="hover:bg-indigo-50 transition-all duration-200 border-b border-gray-100"
                  >
                    <TableCell>
                      <Image
                        src={
                          prod.media[0]?.image
                            ? `http://127.0.0.1:8000/${prod.media[0]?.image}`
                            : "/placeholder.png"
                        }
                        alt={prod.name}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-md object-cover border"
                      />
                    </TableCell>
                    <TableCell className="font-semibold text-yellow-800">
                      <span className="text-base font-semibold">
                        {prod.name}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-green-800">
                      <span className="text-base">${prod.price}</span>
                    </TableCell>
                    <TableCell>
                      {parseFloat(prod.discount_rate) > 0 ? (
                        <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200 transition-colors">
                          {prod.discount_rate}%
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors">
                          No Discount
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {prod.quantity_in_stock > 0 ? (
                        <Badge className="bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors">
                          {prod.quantity_in_stock} in stock
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors">
                          Out of stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-indigo-800 font-semibold">
                      <span className="text-base">{prod.sku}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          prod.is_active
                            ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors"
                            : "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors"
                        }
                      >
                        {prod.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-blue-800">
                      <span className="text-base">{prod.category}</span>
                    </TableCell>
                    <TableCell className="font-semibold text-purple-800">
                      <span className="text-base">{prod.brand}</span>
                    </TableCell>
                    <TableCell className="bg-gray-50 text-right">
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
          </div>

          {/*  SmartPagination instead of manual pagination */}
          <SmartPagination paginationData={paginationData} className="mt-6" />
        </CardContent>
      </div>
    </div>
  );
}
