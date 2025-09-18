"use client";
import type React from "react";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronRight, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAddMemberStore } from "@/store/store";

import useGetMember from "@/hooks/data/useGetMember";
import { ImageViewer } from "../utils/ImageViewer";

const validationSchema = Yup.object({
  member_ID: Yup.string().required("Member ID is required"),
  companion_name: Yup.string().required("Companion name is required"),
  companion_dob: Yup.date().required("Companion date of birth is required"),
  companion_contact_number: Yup.string().required(
    "Companion contact number is required"
  ),
  companion_card_number: Yup.string().required(
    "Companion card number is required"
  ),
  relation_with_member: Yup.string().required(
    "Relation with member is required"
  ),
  companion_image: Yup.mixed().nullable(),
});

export default function CompanionDetailsStep() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { currentStep, nextStep, markStepCompleted, memberID, isUpdateMode } =
    useAddMemberStore();

  const { data, isLoading: isLoadingMember } = useGetMember(memberID, {
    enabled: isUpdateMode && !!memberID,
  });
  const { companion: memberData } = data ?? {};

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const handleImageClick = (image: any) => {
    setSelectedImage(image);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedImage(null);
  };

  const { mutate: addCompanionFunc, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value as any);
      });

      const res = await axiosInstance.post(
        `/api/member/v1/members/companion/`,
        userData,
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
        formik.resetForm();
        toast.success(data.message || "Companion has been successfully added.");
        markStepCompleted(currentStep);
        nextStep();
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response?.data || {};

      if (errors && typeof errors === "object") {
        for (const [fieldName, messages] of Object.entries(errors)) {
          if (Array.isArray(messages) && messages.length > 0) {
            formik.setFieldError(fieldName, messages[0]);
            if (fieldName === "member_ID") {
              toast.error(messages[0]);
              return;
            }
          }
        }
        toast.error("Submission Failed");
      } else {
        toast.error(detail || message || "Submission Failed");
      }
    },
  });

  const { mutate: updateCompanionFunc, isPending: isUpdating } = useMutation({
    mutationFn: async (userData: any) => {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value as any);
      });

      const res = await axiosInstance.patch(
        `/api/member/v1/members/companion/`,
        userData,
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
        queryClient.invalidateQueries({ queryKey: ["useGetMember", memberID] });
        toast.success(data.message || "Companion updated.");
        markStepCompleted(currentStep);
        nextStep();
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response?.data || {};

      if (errors && typeof errors === "object") {
        for (const [fieldName, messages] of Object.entries(errors)) {
          if (Array.isArray(messages) && messages.length > 0) {
            formik.setFieldError(fieldName, messages[0]);
            if (fieldName === "member_ID") {
              toast.error(messages[0]);
              return;
            }
          }
        }
        toast.error("Submission Failed");
      } else {
        toast.error(detail || message || "Submission Failed");
      }
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      isUpdateMode && memberData && memberData?.length > 0
        ? {
            member_ID: memberID,
            id: memberData[0]?.id || 0,
            companion_name: memberData[0]?.companion_name || "",
            companion_dob: memberData[0]?.companion_dob || null,
            companion_contact_number:
              memberData[0]?.companion_contact_number || "",
            companion_card_number: memberData[0]?.companion_card_number || "",
            relation_with_member: memberData[0]?.relation_with_member || "",
            companion_image: null as File | null,
          }
        : {
            member_ID: memberID,
            companion_name: "",
            companion_dob: null as Date | null,
            companion_contact_number: "",
            companion_card_number: "",
            relation_with_member: "",
            companion_image: null as File | null,
          },
    validationSchema,
    onSubmit: (values) => {
      if (!memberID) {
        toast.error("No Member ID found.");
        return;
      }
      if (isUpdateMode) {
        updateCompanionFunc(values);
      } else {
        addCompanionFunc(values);
      }
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue("companion_image", file);
    } else {
      toast.error("No file selected");
    }
  };

  const removeFile = () => {
    formik.setFieldValue("companion_image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateField = (field: string, value: any) => {
    formik.setFieldValue(field, value);
  };

  //Button Functions
  const handleSkip = () => {
    nextStep();
  };

  const handleSaveAndExit = () => {
    formik.resetForm();
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="companion_name"
              className="text-sm font-medium"
            >
              Companion Name
            </Label>
            <Input
              id="companion_name"
              name="companion_name"
              value={formik.values.companion_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Companion Name"
              className="w-full"
            />
            {formik.touched.companion_name && formik.errors.companion_name && (
              <p className="text-sm text-red-600">
                {formik.errors.companion_name as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Date of Birth
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formik.values.companion_dob && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formik.values.companion_dob
                    ? format(formik.values.companion_dob, "PPP")
                    : "Select Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={
                    formik.values.companion_dob
                      ? new Date(formik.values.companion_dob)
                      : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = format(date, "yyyy-MM-dd");
                      updateField("companion_dob", formattedDate);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {formik.touched.companion_dob && formik.errors.companion_dob && (
              <p className="text-sm text-red-600">
                {formik.errors.companion_dob as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="companion_contact_number"
              className="text-sm font-medium"
            >
              Contact Number
            </Label>
            <Input
              id="companion_contact_number"
              name="companion_contact_number"
              type="tel"
              value={formik.values.companion_contact_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Companion Contact"
              className="w-full"
            />

            {formik.touched.companion_contact_number &&
              formik.errors.companion_contact_number && (
                <p className="text-sm text-red-600">
                  {formik.errors.companion_contact_number as string}
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="companion_card_number"
              className="text-sm font-medium"
            >
              Companion Card Number
            </Label>
            <Input
              id="companion_card_number"
              name="companion_card_number"
              value={formik.values.companion_card_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Companion Card Number"
              className="w-full"
            />

            {formik.touched.companion_card_number &&
              formik.errors.companion_card_number && (
                <p className="text-sm text-red-600">
                  {formik.errors.companion_card_number as string}
                </p>
              )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="relation_with_member"
              className="text-sm font-medium"
            >
              Relation with Member
            </Label>
            <Input
              id="relation_with_member"
              name="relation_with_member"
              value={formik.values.relation_with_member}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Relation with Member"
              className="w-full"
            />

            {formik.touched.relation_with_member &&
              formik.errors.relation_with_member && (
                <p className="text-sm text-red-600">
                  {formik.errors.relation_with_member as string}
                </p>
              )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Companion Picture
              </Label>
              {isUpdateMode && (
                <p
                  className="text-sm text-gray-500 pr-5 cursor-pointer hover:text-indigo-500"
                  onClick={() =>
                    handleImageClick(memberData[0]?.companion_image)
                  }
                >
                  {memberData[0]?.companion_image?.split("/").pop()}
                </p>
              )}
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              {formik.values.companion_image ? (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">
                    {formik.values.companion_image.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <div className="flex gap-3 flex-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSaveAndExit()}
              className="flex-1 sm:flex-none"
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSkip()}
              className="flex-1 sm:flex-none"
            >
              Skip
            </Button>
          </div>
          <Button
            type="submit"
            disabled={isPending || isUpdating}
            className="flex-1 sm:flex-none sm:min-w-[140px]"
          >
            {isPending || isUpdating ? "Saving..." : "Save & Next"}{" "}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
      <ImageViewer
        image={selectedImage}
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
      />
    </div>
  );
}
