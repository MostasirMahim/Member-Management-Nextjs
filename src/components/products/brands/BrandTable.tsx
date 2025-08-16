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
import EditBrandModal from "@/components/products/brands/EditBrandModal";
import DeleteBrandDialog from "@/components/products/brands/DeleteBrandDialog";

interface Brand {
  readonly id: number;
  name: string;
  is_active: boolean;
  readonly created_at: string;
  readonly updated_at: string;
}

interface BrandResponse {
  code: number;
  message: string;
  status: string;
  data: Brand[];
}

interface Props {
  brands: BrandResponse;
}

export default function BrandTable({ brands }: Props) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

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
          All Product Brands
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full text-sm text-gray-700">
          <TableHeader className="bg-gray-100">
            <TableRow className="bg-gray-100 font-bold text-sm">
              <TableHead className="w-10 text-gray-500">ID</TableHead>
              <TableHead className="text-gray-600">Brand Name</TableHead>
              <TableHead className="text-gray-600">Status</TableHead>
              <TableHead className="text-gray-600">Created At</TableHead>
              <TableHead className="text-gray-600">Updated At</TableHead>
              <TableHead className="text-right text-gray-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.data?.map((brand) => (
              <TableRow
                key={brand.id}
                className="hover:bg-indigo-50 transition-all duration-200"
              >
                <TableCell className="font-medium text-gray-700">
                  {brand.id}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {brand.name}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      brand.is_active
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {brand.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {formatBDTime(brand.created_at)}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {formatBDTime(brand.updated_at)}
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
                          setSelectedBrand(brand);
                          setEditModalOpen(true);
                        }}
                        className="text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600 hover:bg-red-100 cursor-pointer"
                        onClick={() => {
                          setSelectedBrand(brand);
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
      {selectedBrand && (
       <EditBrandModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        brand={selectedBrand}
      />

      )}

      {/* Delete Confirmation Dialog */}
      {selectedBrand && (
        <DeleteBrandDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          brandId={selectedBrand.id}
        />
      )}
    </Card>
  );
}
