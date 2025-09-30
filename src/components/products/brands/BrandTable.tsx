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
import RefreshButton from "@/components/utils/RefreshButton";

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
    <Card >
      <CardHeader className="flex flex-row items-center gap-2 w-full">
        <CardTitle className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6" />
            <span className="text-2xl font-bold">Brand List</span>
          </div>
          <RefreshButton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full text-sm ">
          <TableHeader>
            <TableRow className="font-bold text-sm">
              <TableHead className="w-10 ">ID</TableHead>
              <TableHead className="">Brand Name</TableHead>
              <TableHead className="">Status</TableHead>
              <TableHead className="">Created At</TableHead>
              <TableHead className="">Updated At</TableHead>
              <TableHead className="">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.data?.map((brand) => (
              <TableRow
                key={brand.id}
                className="transition-all duration-200"
              >
                <TableCell className="font-medium">
                  {brand.id}
                </TableCell>
                <TableCell className="font-semibold">
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
                <TableCell className="font-semibold">
                  {formatBDTime(brand.created_at)}
                </TableCell>
                <TableCell className="font-semibold">
                  {formatBDTime(brand.updated_at)}
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
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedBrand(brand);
                          setEditModalOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600 hover:bg-red-100 dark:hover:bg-red-800 cursor-pointer"
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
      {selectedBrand && (
        <EditBrandModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          brand={selectedBrand}
        />
      )}
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
