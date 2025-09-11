"use client";
import type React from "react";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Upload,
  X,
  Plus,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { useAddMemberStore } from "@/store/store";
import { useRouter } from "next/navigation";
import useGetAllChoice from "@/hooks/data/useGetAllChoice";

import useGetMember from "@/hooks/data/useGetMember";
import { ImageViewer } from "../utils/ImageViewer";

const validationSchema = Yup.object({
  data: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required("Descendant name is required"),
        descendant_contact_number: Yup.string().required(
          "Contact number is required"
        ),
        dob: Yup.date().required("Date of birth is required"),
        image: Yup.mixed().nullable().required("Profile picture is required"),
        relation_type: Yup.string().required("Relation type is required"),
      })
    )
    .min(1, "At least one descendant is required"),
});
const validationSchemaForUpdate = Yup.object({
  data: Yup.array()
    .of(
      Yup.object({
        id: Yup.number().nullable(),
        name: Yup.string().required("Descendant name is required"),
        descendant_contact_number: Yup.string().required(
          "Contact number is required"
        ),
        dob: Yup.date().required("Date of birth is required"),
        image: Yup.mixed()
          .nullable()
          .test(
            "image-required-if-no-id",
            "Profile picture is required",
            function (value: any) {
              if (!this.parent.id && !value) {
                return false;
              }
              return true;
            }
          ),
        relation_type: Yup.string().required("Relation type is required"),
      })
    )
    .min(1, "At least one descendant is required"),
});

export default function DescendantsDetailsStep() {
  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    currentStep,
    setCurrentStep,
    nextStep,
    markStepCompleted,
    memberID,
    setMemberID,
    isUpdateMode,
  } = useAddMemberStore();

  const { data, isLoading: isLoadingMember } = useGetMember(memberID, {
    enabled: isUpdateMode && !!memberID,
  });
  const { descendant: memberData } = data ?? {};
  const { data: choiceSections, isLoading } = useGetAllChoice();
  const { descendant_relation_choice } = choiceSections ?? {};

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

  const { mutate: addDescendantFunc, isPending } = useMutation({
    mutationFn: async (userData: any[]) => {
      const errors: Record<string, string> = {};

      const responses = await Promise.allSettled(
        userData.map(async (descendant, index) => {
          try {
            const formData = new FormData();

            Object.entries(descendant).forEach(([key, value]) => {
              if (value instanceof File || value instanceof Blob) {
                formData.append(key, value);
              } else if (
                typeof value === "boolean" ||
                typeof value === "number"
              ) {
                formData.append(key, String(value));
              } else if (value !== null && value !== undefined) {
                formData.append(key, value as any);
              }
            });

            const res = await axiosInstance.post(
              "/api/member/v1/members/descendants/",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            return res.data;
          } catch (err: any) {
            const { errors: resErrors } = err?.response?.data || {};
            console.log(err?.response?.data);
            if (resErrors && typeof resErrors === "object") {
              for (const [fieldName, messages] of Object.entries(resErrors)) {
                if (Array.isArray(messages) && messages.length > 0) {
                  const fieldPath = `data.${index}.${fieldName}`;
                  errors[fieldPath] = messages[0];
                }
              }
            }

            return null;
          }
        })
      );

      Object.entries(errors).forEach(([fieldPath, message]) => {
        formik.setFieldError(fieldPath, message);
      });

      const successfulData = responses
        .map((res) => (res.status === "fulfilled" ? res.value : null))
        .filter((val) => val !== null);

      const anyFailed = responses.some(
        (res) => res.status === "rejected" || res.value === null
      );

      if (anyFailed) {
        throw new Error("Some descendants failed to submit.");
      }

      return successfulData;
    },

    onSuccess: (dataArray) => {
      if (Array.isArray(dataArray) && dataArray.length > 0) {
        formik.resetForm();
        toast.success("All descendants have been successfully added.");
        markStepCompleted(currentStep);
        nextStep();
      }
    },

    onError: (error: any) => {
      console.error("Descendant submit error:", error);
      toast.error(error?.message || "Some descendants failed to submit.");
    },
  });

  const { mutate: updateDescendantFunc, isPending: isUpdating } = useMutation({
    mutationFn: async (userData: any[]) => {
      const errors: Record<string, string> = {};

      const responses = await Promise.allSettled(
        userData.map(async (descendant, index) => {
          try {
            const formData = new FormData();

            Object.entries(descendant).forEach(([key, value]) => {
              if (value instanceof File || value instanceof Blob) {
                formData.append(key, value);
              } else if (
                typeof value === "boolean" ||
                typeof value === "number"
              ) {
                formData.append(key, String(value));
              } else if (value !== null && value !== undefined) {
                formData.append(key, value as any);
              }
            });

            const res = await axiosInstance.patch(
              `/api/member/v1/members/descendants/`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            return res.data;
          } catch (err: any) {
            const { errors: resErrors } = err?.response?.data || {};
            console.log(err);
            if (resErrors && typeof resErrors === "object") {
              for (const [fieldName, messages] of Object.entries(resErrors)) {
                if (Array.isArray(messages) && messages.length > 0) {
                  const fieldPath = `data.${index}.${fieldName}`;
                  errors[fieldPath] = messages[0];
                }
              }
            }
            return null;
          }
        })
      );

      Object.entries(errors).forEach(([fieldPath, message]) => {
        formik.setFieldError(fieldPath, message);
      });

      const successfulData = responses
        .map((res) => (res.status === "fulfilled" ? res.value : null))
        .filter((val) => val !== null);

      const anyFailed = responses.some(
        (res) => res.status === "rejected" || res.value === null
      );

      if (anyFailed) {
        throw new Error("Some descendants failed to update.");
      }

      return successfulData;
    },

    onSuccess: (dataArray) => {
      if (Array.isArray(dataArray) && dataArray.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["useGetMember", memberID] });
        toast.success("All descendants updated.");
        markStepCompleted(currentStep);
        nextStep();
      }
    },

    onError: (error: any) => {
      console.error("Descendant update error:", error);
      toast.error(error?.message || "Some descendants failed to update.");
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      isUpdateMode && memberData && memberData?.length > 0
        ? {
            data: memberData?.map((d: any) => ({
              id: d?.id || 0,
              member_ID: memberID,
              name: d?.name || "",
              descendant_contact_number: d?.descendant_contact_number || "",
              dob: d?.dob || null,
              image: null as File | null,
              relation_type: d?.relation_type?.id?.toString() || "",
            })),
          }
        : {
            data: [
              {
                member_ID: memberID,
                name: "",
                descendant_contact_number: "",
                dob: null as Date | null,
                image: null as File | null,
                relation_type: "",
              },
            ],
          },
    validationSchema: isUpdateMode
      ? validationSchemaForUpdate
      : validationSchema,
    onSubmit: (values) => {
      if (!memberID) {
        toast.error("No Member ID found.");
        return;
      }
      if (isUpdateMode) {
        updateDescendantFunc(values.data);
      } else {
        addDescendantFunc(values.data);
      }
    },
  });

  const addDescendant = () => {
    const newDescendant = {
      member_ID: memberID,
      name: "",
      descendant_contact_number: "",
      dob: null as Date | null,
      image: null as File | null,
      relation_type: "",
    };
    const updatedDescendants = [...formik.values.data, newDescendant];
    formik.setFieldValue("data", updatedDescendants);
  };

  const removeDescendant = (index: number) => {
    if (formik.values.data.length > 1) {
      const updatedDescendants = formik.values.data.filter(
        (_: any, i: any) => i !== index
      );
      formik.setFieldValue("data", updatedDescendants);
    } else {
      toast.error(
        "Cannot remove descendant - at least one descendant is required"
      );
    }
  };

  const updateDescendant = (index: number, field: string, value: any) => {
    formik.setFieldValue(`data.${index}.${field}`, value);
  };

  const handleFileUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      updateDescendant(index, "image", file);
    } else {
      toast.error("No file selected");
    }
  };

  const handleSkip = () => {
    nextStep();
  };

  const handleSaveAndExit = () => {
    formik.resetForm();
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {formik.values.data.map((descendant: any, index: number) => {
            return (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-4 relative"
              >
                {formik.values.data.length > 1 && (
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">
                      Descendant {index + 1}
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDescendant(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-1">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Descendant Name
                    </Label>
                    <Input
                      placeholder="Enter Descendant Name"
                      value={descendant.name}
                      onChange={(e) =>
                        updateDescendant(index, "name", e.target.value)
                      }
                      onBlur={formik.handleBlur}
                      name={`data.${index}.name`}
                      className="w-full"
                    />

                    {(formik.touched.data as any[])?.[index]?.name &&
                      (formik.errors.data as any[])?.[index]?.name && (
                        <p className="text-sm text-red-600">
                          {(formik.errors.data as any[])?.[index]?.name}
                        </p>
                      )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Contact Number
                    </Label>
                    <Input
                      type="tel"
                      placeholder="Enter Descendant Contact"
                      value={descendant.descendant_contact_number}
                      onChange={(e) =>
                        updateDescendant(
                          index,
                          "descendant_contact_number",
                          e.target.value
                        )
                      }
                      onBlur={formik.handleBlur}
                      name={`data.${index}.descendant_contact_number`}
                      className="w-full"
                    />

                    {(formik.touched.data as any[])?.[index]
                      ?.descendant_contact_number &&
                      (formik.errors.data as any[])?.[index]
                        ?.descendant_contact_number && (
                        <p className="text-sm text-red-600">
                          {
                            (formik.errors.data as any[])?.[index]
                              ?.descendant_contact_number
                          }
                        </p>
                      )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Date of Birth
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !descendant.dob && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {descendant.dob
                            ? format(descendant.dob, "PPP")
                            : "Select Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={
                            descendant.dob
                              ? new Date(descendant.dob)
                              : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              const formattedDate = format(date, "yyyy-MM-dd");
                              updateDescendant(index, "dob", formattedDate);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    {(formik.touched.data as any[])?.[index]?.dob &&
                      (formik.errors.data as any[])?.[index]?.dob && (
                        <p className="text-sm text-red-600">
                          {(formik.errors.data as any[])?.[index]?.dob}
                        </p>
                      )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700">
                        Descendant Picture
                      </Label>
                      {isUpdateMode && (
                        <p
                          className="text-sm text-gray-500 pr-5 cursor-pointer hover:text-indigo-500"
                          onClick={() =>
                            handleImageClick(memberData[index]?.image)
                          }
                        >
                          {memberData[index]?.image?.split("/").pop()}
                        </p>
                      )}
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        ref={(el) => {
                          fileInputRefs.current[index] = el;
                        }}
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleFileUpload(index, event)}
                        className="hidden"
                      />
                      {descendant.image ? (
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">
                            {descendant.image.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              updateDescendant(index, "image", null);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            fileInputRefs.current[index]?.click();
                          }}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      )}
                    </div>
                    {(formik.touched.data as any[])?.[index]?.image &&
                      (formik.errors.data as any[])?.[index]?.image && (
                        <p className="text-sm text-red-600">
                          {(formik.errors.data as any[])?.[index]?.image}
                        </p>
                      )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Relation Type
                    </Label>
                    <Select
                      value={descendant.relation_type}
                      onValueChange={(value) =>
                        updateDescendant(index, "relation_type", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="What is the Relation with Member?">
                          {
                            descendant_relation_choice?.find(
                              (c: any) =>
                                String(c.id) ===
                                String(formik.values.data[index].relation_type)
                            )?.name
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {descendant_relation_choice?.map((option: any) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(formik.touched.data as any[])?.[index]?.relation_type &&
                      (formik.errors.data as any[])?.[index]?.relation_type && (
                        <p className="text-sm text-red-600">
                          {
                            (formik.errors.data as any[])?.[index]
                              ?.relation_type
                          }
                        </p>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDescendant}
              className="gap-2 bg-transparent"
            >
              <Plus className="w-4 h-4" />
              Add Another
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <div className="flex gap-3 flex-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSaveAndExit()}
              className="flex-1 sm:flex-none bg-transparent"
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleSkip()}
              className="flex-1 sm:flex-none"
            >
              Skip
            </Button>
          </div>
          <Button
            type="submit"
            disabled={isPending || isUpdating}
            className="bg-black hover:bg-gray-800 text-white flex-1 sm:flex-none sm:min-w-[140px]"
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
