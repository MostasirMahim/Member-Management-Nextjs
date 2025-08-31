"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { MoreVertical, Pencil, Trash2, Layers } from "lucide-react";
import { usePathname } from "next/navigation";
import EditCategoryModal from "@/components/products/categories/EditCategoryModal";
import DeleteCategoryDialog from "@/components/products/categories/DeleteCategoryDialog";

interface Category {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CategoryResponse {
  code: number;
  message: string;
  status: string;
  data: Category[];
}

interface Props {
  categories: CategoryResponse;
}

export default function CategoryTable({ categories }: Props) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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
        <Layers className="h-6 w-6 text-gray-500 dark:text-gray-300" />
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
          All Product Categories
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table className="w-full text-sm text-gray-700 dark:text-gray-300">
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            <TableRow className="font-bold text-gray-700 dark:text-gray-200">
              <TableHead className="w-10">ID</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Is Active</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.data?.map((cat) => (
              <TableRow
                key={cat.id}
                className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <TableCell className="font-medium">{cat.id}</TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                  {cat.name}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      cat.is_active
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {cat.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatBDTime(cat.created_at)}
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatBDTime(cat.updated_at)}
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
                    <DropdownMenuContent align="end" className="dark:bg-gray-800">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCategory(cat);
                          setEditModalOpen(true);
                        }}
                        className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-700 cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 cursor-pointer"
                        onClick={() => {
                          setSelectedCategory(cat);
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
      {selectedCategory && (
        <EditCategoryModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          category={selectedCategory}
        />
      )}

      {/* Delete Dialog */}
      {selectedCategory && (
        <DeleteCategoryDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          categoryId={selectedCategory.id}
        />
      )}
    </div>
  );
}
