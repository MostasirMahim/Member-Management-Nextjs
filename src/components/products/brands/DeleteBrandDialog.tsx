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
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  brandId: number;
}

export default function DeleteBrandDialog({
  open,
  onClose,
  brandId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false); 

  const handleDelete = async () => {
    setLoading(true); 
    try {
      const res = await axiosInstance.delete(
        `/api/product/v1/products/brands/${brandId}/`
      );
      toast.success(res.data.message || "Brand deleted successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      onClose();
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete brand",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this brand?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading} 
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
