"use client"

import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Pencil, Trash2, Eye, Package } from "lucide-react"
import { SearchFilterSection } from "@/components/products/SearchFilterSection"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { SmartPagination } from "@/components/utils/SmartPagination"

interface Media {
  id: number
  image: string
  is_active: boolean
}

interface Product {
  id: number
  media: Media[]
  category: string
  brand: string
  name: string
  description: string
  price: string
  discount_rate: string
  quantity_in_stock: number
  sku: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ProductResponse {
  code: number
  message: string
  status: string
  data: Product[]
}

interface Props {
  products: ProductResponse
}

export default function ProductTable({ products }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const searchQuery = searchParams.get("search") || ""
  const selectedCategory = searchParams.get("category") || "all"
  const selectedBrand = searchParams.get("brand") || "all"
  const pageParam = Number.parseInt(searchParams.get("page") || "1", 10)

  const itemsPerPage = 10

  // Filter products
  const filteredProducts = products?.data?.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false
    if (selectedBrand !== "all" && p.brand !== selectedBrand) return false
    return true
  })

  // Pagination calc
  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage)
  const currentPage = pageParam > totalPages ? 1 : pageParam

  // Slice data for current page
  const paginatedProducts = filteredProducts?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Prepare paginationData for SmartPagination
  const paginationData = {
    count: filteredProducts?.length || 0,
    total_pages: totalPages,
    current_page: currentPage,
    next: currentPage < totalPages ? `?page=${currentPage + 1}` : null,
    previous: currentPage > 1 ? `?page=${currentPage - 1}` : null,
    page_size: itemsPerPage,
  }

  return (
    <div className="w-full">
      <div>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-t-2xl">
          <div className="flex flex-row items-center gap-2">
            <Package className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl md:text-2xl font-bold text-primary tracking-tight drop-shadow">
              Product Inventory
            </CardTitle>
          </div>
          <SearchFilterSection
            filterOptions={{
              categories: Array.from(new Set(products?.data?.map((p) => p.category))),
              brands: Array.from(new Set(products?.data?.map((p) => p.brand))),
            }}
          />
        </CardHeader>

        <CardContent>
          <div className="w-full overflow-x-auto rounded-md border bg-background">
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-foreground font-bold text-base py-4">Image</TableHead>
                  <TableHead className="text-foreground font-bold text-base py-4">Name</TableHead>
                  <TableHead className="text-foreground font-bold text-base py-4">Price</TableHead>
                  <TableHead className="text-foreground font-bold text-base py-4">Discount</TableHead>
                  <TableHead className="text-foreground font-bold text-base py-4">Stock</TableHead>
                  <TableHead className="text-foreground font-bold text-base py-4">SKU</TableHead>
                  <TableHead className="text-foreground font-bold text-base py-4">Status</TableHead>
                  <TableHead className="text-foreground font-bold text-base py-4">Category</TableHead>
                  <TableHead className="text-foreground font-bold text-base py-4">Brand</TableHead>
                  <TableHead className="text-foreground font-bold text-base py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts?.map((prod) => (
                  <TableRow
                    key={prod.id}
                    className="hover:bg-muted/50 transition-all duration-200 border-b border-border"
                  >
                    <TableCell>
                      <Image
                        src={
                          prod.media[0]?.image ? `http://127.0.0.1:8000/${prod.media[0]?.image}` : "/placeholder.png"
                        }
                        alt={prod.name}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-md object-cover border border-border"
                      />
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      <span className="text-base font-semibold">{prod.name}</span>
                    </TableCell>
                    <TableCell className="font-medium text-green-700 dark:text-green-400">
                      <span className="text-base">${prod.price}</span>
                    </TableCell>
                    <TableCell>
                      {Number.parseFloat(prod.discount_rate) > 0 ? (
                        <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200 transition-colors dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700">
                          {prod.discount_rate}%
                        </Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-colors">
                          No Discount
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {prod.quantity_in_stock > 0 ? (
                        <Badge className="bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
                          {prod.quantity_in_stock} in stock
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-300 dark:border-red-700">
                          Out of stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-primary font-semibold">
                      <span className="text-base">{prod.sku}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          prod.is_active
                            ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
                            : "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
                        }
                      >
                        {prod.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-blue-700 dark:text-blue-400">
                      <span className="text-base">{prod.category}</span>
                    </TableCell>
                    <TableCell className="font-semibold text-purple-700 dark:text-purple-400">
                      <span className="text-base">{prod.brand}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border border-border">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/products/${prod.id}`}
                              className="flex items-center text-primary hover:bg-muted cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-primary hover:bg-muted cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive hover:bg-destructive/10 cursor-pointer">
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
  )
}
