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
  //TODO: need to work on theme - Media Table
  return (
    <div>
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
        <Table className="w-full text-sm text-gray-700 dark:text-gray-200">
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            <TableRow className="font-extrabold text-sm">
              <TableHead className="w-10 text-gray-600 dark:text-gray-300">
                ID
              </TableHead>
              <TableHead className="w-10 text-gray-600 dark:text-gray-300">
                Image
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300">
                Product Name
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300">
                Product SKU
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300">
                Is Active
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300">
                Created At
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300">
                Updated At
              </TableHead>
              <TableHead className="text-right text-gray-500 dark:text-gray-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {media.data?.map((med: Media) => (
              <TableRow
                key={med.id}
                className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <TableCell className="font-medium text-gray-700 dark:text-gray-200">
                  {med.id}
                </TableCell>
                <TableCell>
                  <Image
                    src={
                      med.image
                        ? `http://127.0.0.1:8000/${med.image}`
                        : "/placeholder.png"
                    }
                    alt={med.product.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover border border-gray-300 dark:border-gray-600"
                  />
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                  {med.product.name}
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
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
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatBDTime(med.created_at)}
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatBDTime(med.updated_at)}
                </TableCell>
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
                    <DropdownMenuContent
                      align="end"
                      className="dark:bg-gray-800"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedMedia(med);
                          setEditModalOpen(true);
                        }}
                        className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-700 cursor-pointer"
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

      {/* Edit Modal */}
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

      {/* Delete Dialog */}
      {selectedMedia && (
        <DeleteCategoryDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          categoryId={selectedMedia.id}
        />
      )}
    </div>
  );
}
