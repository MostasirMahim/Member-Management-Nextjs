"use client";

import type React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, ImageIcon } from "lucide-react";
import useGetAllEvents from "@/hooks/data/useGetAllEvents";
import { LoadingCard } from "../ui/loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  event: Yup.number()
    .required("Event is required")
    .min(1, "Please select an event"),
  image: Yup.mixed().required("Image is required"),
});

export function MediaUploadForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { data: AllEvents, isLoading } = useGetAllEvents();
  const querClient = useQueryClient();

  const { mutate: uploadMedia, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value as any);
      });

      const res = await axiosInstance.post(
        `/api/event/v1/events/media/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        toast.success(data.message || "Media has been successfully added.");
        formik.resetForm();
        setPreviewUrl(null);
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      console.log(errors);
      if (errors && typeof errors === "object") {
        Object.entries(errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            formik.setFieldError(field, messages[0]);
          }
        });
        toast.error(message || detail || "Validation failed.");
      } else {
        toast.error(
          detail || message || "An error occurred during submission."
        );
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      event: "",
      image: null as File | null,
    },
    validationSchema,
    onSubmit: (values) => {
      uploadMedia(values);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      formik.setFieldValue("image", file);
    } else {
      setPreviewUrl(null);
      formik.setFieldValue("image", null);
    }
  };

  const selectedEvent = AllEvents?.data?.find(
    (event: any) => event.id === formik.values.event
  );
  if (isLoading) return <LoadingCard />;
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Media
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="event">Event *</Label>
            <Select
              value={formik.values.event}
              onValueChange={(value) => formik.setFieldValue("event", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {AllEvents?.data?.map((event: any) => (
                  <SelectItem key={event.id} value={event.id.toString()}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.event && formik.errors.event && (
              <p className="text-sm text-red-500">{formik.errors.event}</p>
            )}
            {selectedEvent && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedEvent.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Upload Images *</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label
                htmlFor="image"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Click to upload an image
                </span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </span>
              </Label>
            </div>
            {formik.touched.image && formik.errors.image && (
              <p className="text-sm text-red-500">{formik.errors.image}</p>
            )}
          </div>

          {previewUrl && (
            <div className="space-y-2">
              <Label>Selected Image</Label>
              <div className="relative w-full max-w-xs mx-auto">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={() => {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                    formik.setFieldValue("image", null);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                  {formik.values.image?.name}
                </div>
              </div>
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !formik.isValid}
          >
            Upload Media
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
