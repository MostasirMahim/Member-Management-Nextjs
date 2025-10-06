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
import EditCategoryModal from "@/components/products/categories/EditCategoryModal";
import DeleteCategoryDialog from "@/components/products/categories/DeleteCategoryDialog";
import Image from "next/image";
import RefreshButton from "@/components/utils/RefreshButton";

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Media {
  id: number;
  image: string;
  product: Product;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface MediaResponse {
  code: number;
  message: string;
  status: string;
  data: Media[];
}

interface Props {
  media: any;
}

export default function MediaTable({ media }: Props) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
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
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <CardTitle className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6" />
            <span className="text-2xl font-bold">Media List</span>
          </div>
          <RefreshButton />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table className="w-full text-sm ">
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            <TableRow className="font-extrabold text-sm">
              <TableHead className="w-10 ">
                ID
              </TableHead>
              <TableHead className="w-10 ">
                Image
              </TableHead>
              <TableHead >
                Product Name
              </TableHead>
              <TableHead >
                Product SKU
              </TableHead>
              <TableHead>
                Is Active
              </TableHead>
              <TableHead >
                Created At
              </TableHead>
              <TableHead>
                Updated At
              </TableHead>
              <TableHead>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {media.data?.map((med: Media) => (
              <TableRow
                key={med.id}
                className="transition-all duration-200"
              >
                <TableCell className="font-medium">
                  {med.id}
                </TableCell>
                <TableCell>
                  <Image
                    src={
                      med.image
                        ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${med.image}`
                        : "/placeholder.png"
                    }
                    alt={med.product.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover border"
                  />
                </TableCell>
                <TableCell className="font-semibold">
                  {med.product.name}
                </TableCell>
                <TableCell className="font-semibold">
                  {med.product.sku}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      med.is_active ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {med.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">
                  {formatBDTime(med.created_at)}
                </TableCell>
                <TableCell className="font-semibold">
                  {formatBDTime(med.updated_at)}
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
                          setSelectedMedia(med);
                          setEditModalOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 cursor-pointer"
                        onClick={() => {
                          setSelectedMedia(med);
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

      {selectedMedia && (
        <EditCategoryModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          category={{
            id: selectedMedia.id,
            name: selectedMedia.product.name,
            is_active: selectedMedia.is_active,
          }}
        />
      )}

      {selectedMedia && (
        <DeleteCategoryDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          categoryId={selectedMedia.id}
        />
      )}
    </Card>
  );
}
