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
  invoiceId: number;
}

export default function InvoiceDeleteDialog({
  open,
  onClose,
  invoiceId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false); 

  const handleDelete = async () => {
    setLoading(true); 
    try {
      const res = await axiosInstance.delete(
        `/api/member_financial/v1/invoices/${invoiceId}/`
      );
      toast.success(res.data.message || "Invoice deleted successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      onClose();
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete invoice",
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
            Are you sure you want to soft delete this invoice?
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
