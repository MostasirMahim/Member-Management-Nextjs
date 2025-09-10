"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Share,
  MoreHorizontal,
  Star,
  Trash2,
  X,
} from "lucide-react";



interface ImageViewerProps {
  image: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({ image, isOpen, onClose }: ImageViewerProps) {
  if (!isOpen || !image) return null;
    const imgUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000"}${image}`;
  return (
    <div className="fixed inset-0 z-50 bg-slate-200/90 dark:bg-slate-900/90 flex flex-col h-[500px] max-w-sm sm:max-w-lg m-auto font-poppins rounded-xl overflow-hidden">
      <div className="relative bg-slate-900 dark:bg-slate-800">
        <div className="flex items-center justify-between p-4 text-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-white hidden sm:flex"
            >
              <Share className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-white hidden sm:flex"
            >
              <Star className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-white hidden sm:flex"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-white hidden sm:flex"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imgUrl}
              alt={"Currently This Image Unavailable In The Server. Please Try Again."}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
