"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

import { useCartStore } from "@/store/cartStore"; // ✅ এখানে নতুন store ইম্পোর্ট হচ্ছে

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Package } from "lucide-react";
import { SearchFilterSection } from "@/components/products/SearchFilterSection";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// ---------------- Interfaces ----------------
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
  const addToCart = useCartStore((state) => state.addToCart);

  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedBrand = searchParams.get("brand") || "all";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 10;

  // 🔍 Filtering
  const filteredProducts = products?.data?.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    if (selectedBrand !== "all" && p.brand !== selectedBrand) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);
  const currentPage = pageParam > totalPages ? 1 : pageParam;
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

  // ✅ Selected products state
  const [selected, setSelected] = useState<{ [key: number]: { checked: boolean; quantity: number } }>({});

  const handleCheckboxChange = (id: number) => {
    setSelected((prev) => ({
      ...prev,
      [id]: { checked: !prev[id]?.checked, quantity: prev[id]?.quantity || 1 },
    }));
  };

  const handleQuantityChange = (id: number, value: number) => {
    setSelected((prev) => ({
      ...prev,
      [id]: { checked: prev[id]?.checked || false, quantity: value },
    }));
  };

  const handleAddToCart = () => {
    const selectedProducts = paginatedProducts
      .filter((prod) => selected[prod.id]?.checked)
      .map((prod) => ({
        id: prod.id,
        name: prod.name,
        sku: prod.sku,
        price: Number(prod.price),
        quantity: selected[prod.id]?.quantity || 1,
      }));

    if (!selectedProducts.length) return toast.error("Please select at least one product");

    for (let prod of selectedProducts) {
      if (!prod.quantity || prod.quantity <= 0)
        return toast.error("Please enter quantity for all selected products");
      if (prod.quantity > products?.data?.find((p) => p.id === prod.id)?.quantity_in_stock)
        return toast.error(`Insufficient stock for ${prod.name}`);
    }

    addToCart(selectedProducts);
  };

  return (
    <Card className="shadow-md border rounded-2xl bg-white">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-row items-center gap-2">
          <Package className="h-6 w-6 opacity-75" />
          <CardTitle className="text-xl font-bold opacity-75">Add Products to Cart</CardTitle>
        </div>
        <SearchFilterSection
          filterOptions={{
            categories: Array.from(new Set(products?.data?.map((p) => p.category))),
            brands: Array.from(new Set(products?.data?.map((p) => p.brand))),
          }}
        />
      </CardHeader>

      <CardContent>
        <Table className="w-full text-sm text-gray-700">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Checkbox</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((prod) => (
              <TableRow key={prod.id} className="hover:bg-indigo-50">
                <TableCell>
                  <Checkbox
                    checked={selected[prod.id]?.checked || false}
                    onCheckedChange={() => handleCheckboxChange(prod.id)}
                  />
                </TableCell>
                <TableCell className="font-semibold">{prod.name}</TableCell>
                <TableCell>${prod.price}</TableCell>
                <TableCell>
                  {prod.quantity_in_stock > 0 ? (
                    <Badge className="bg-green-500 text-white">
                      {prod.quantity_in_stock} in stock
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500 text-white">Out of stock</Badge>
                  )}
                </TableCell>
                <TableCell>{prod.sku}</TableCell>
                <TableCell>
                  <Badge className={prod.is_active ? "bg-green-600 text-white" : "bg-red-500 text-white"}>
                    {prod.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    value={selected[prod.id]?.quantity || ""}
                    onChange={(e) => handleQuantityChange(prod.id, Number(e.target.value))}
                    disabled={!selected[prod.id]?.checked}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                <Button
                  variant="outline"
                  className="w-full mt-5 text-white bg-blue-500"
                  onClick={handleAddToCart}
                >
                  Add Selected to Cart
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* Pagination */}
        <Pagination className="mt-4 justify-center flex">
          <PaginationPrevious onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} />
          <PaginationContent>
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page} onClick={() => goToPage(page)}>
                  <PaginationLink>{page}</PaginationLink>
                </PaginationItem>
              );
            })}
          </PaginationContent>
          <PaginationNext onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} />
        </Pagination>
      </CardContent>
    </Card>
  );
}
