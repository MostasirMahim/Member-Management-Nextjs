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
  console.log("media", media);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState(null);
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
    <div>
      <CardHeader className="flex flex-row items-center gap-2">
        <Layers className=" h-6 w-6 opacity-75" />
        <CardTitle className="text-xl font-bold opacity-75">
          All Products Media
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full text-sm text-gray-700">
          <TableHeader className="bg-gray-100">
            <TableRow className="bg-gray-100 font-extrabold text-sm">
              <TableHead className="w-10 text-gray-600">ID</TableHead>
              <TableHead className="w-10 text-gray-600">Image</TableHead>
              <TableHead className="text-gray-600 ">Product Name</TableHead>
              <TableHead className="text-gray-600">Product SKU</TableHead>
              <TableHead className="text-gray-600">Is Active</TableHead>
              <TableHead className="text-gray-600">Created At</TableHead>
              <TableHead className="text-gray-600">Updated At</TableHead>
              <TableHead className="text-right text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {media.data?.map((med: any, index: number) => (
              <TableRow
                key={med.id}
                className="hover:bg-indigo-50 transition-all duration-200"
              >
                <TableCell className="font-medium text-gray-700">
                  {med.id}
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  <Image
                    src={
                      `http://127.0.0.1:8000/${med.image}` || "/placeholder.png"
                    }
                    alt={med.product.name}
                    width={250}
                    height={250}
                    className=" rounded-md object-cover border"
                  />
                </TableCell>
                <TableCell className="font-semibold text-gray-900 ms-9">
                  {med.product.name}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {med.product.sku}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      med.is_active
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {med.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {formatBDTime(med.created_at)}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {formatBDTime(med.updated_at)}
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
                          setSelectedMedia(med);
                          setEditModalOpen(true);
                        }}
                        className="text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600 hover:bg-red-100 cursor-pointer"
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
          category={selectedMedia}
        />
      )}
      {/* {Delete Dialog} */}
      {selectedMedia && (
        <DeleteCategoryDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          categoryId={(selectedMedia as any).id}
        />
      )}
    </div>
  );
}
