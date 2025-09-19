"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageViewerProps {
  image: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({ image, isOpen, onClose }: ImageViewerProps) {
  if (!isOpen || !image) return null;
  const imgUrl = `${
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000"
  }${image}`;
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col h-[500px] max-w-sm sm:max-w-lg m-auto font-poppins rounded-xl overflow-hidden shadow-lg">
      <div className="relative bg-primary text-foreground border-b border-border">
        <div className="flex items-center justify-between p-4">
          <p className="text-sm font-medium">{imgUrl.split("/").pop()}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-accent "
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imgUrl}
              alt={
                "Currently This Image Unavailable In The Server. Please Try Again."
              }
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
