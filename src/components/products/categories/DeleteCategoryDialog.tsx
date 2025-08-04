"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
  categoryId: number;
}

export default function DeleteCategoryDialog({
  open,
  onClose,
  categoryId,
}: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(
        `/api/product/v1/products/categories/${categoryId}/`
      );
      toast.success(res.data.message || "Category deleted successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      onClose();
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete category",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to soft delete this category?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
