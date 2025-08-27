"use client";
import type React from "react";
import { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Plus, Trash2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAddMemberStore } from "@/store/store";
import useGetAllChoice from "@/hooks/data/useGetAllChoice";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetMember from "@/hooks/data/useGetMember";

const validationSchema = Yup.object({
  data: Yup.array()
    .of(
      Yup.object({
        member_ID: Yup.string().required("Member ID is required"),
        document_document: Yup.mixed().required("Document file is required"),
        document_type: Yup.string().required("Document type is required"),
      })
    )
    .min(1, "At least one document is required"),
});

export default function DocumentDetailsStep() {
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
  const { document: memberData } = data ?? {};

  const { data: choiceSections, isLoading } = useGetAllChoice();
  const { document_type } = choiceSections ?? {};
  const { mutate: addDocumentFunc, isPending } = useMutation({
    mutationFn: async (userData: any[]) => {
      const errors: Record<string, string> = {};

      const responses = await Promise.allSettled(
        userData.map(async (document, index) => {
          try {
            const formData = new FormData();

            Object.entries(document).forEach(([key, value]) => {
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
              "/api/member/v1/members/documents/",
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
        throw new Error("Some documents failed to upload.");
      }

      return successfulData;
    },

    onSuccess: (dataArray) => {
      if (Array.isArray(dataArray) && dataArray.length > 0) {
        formik.resetForm();
        toast.success("All document successfully added.");
        markStepCompleted(currentStep);
        nextStep();
      }
    },

    onError: (error: any) => {
      console.error("Documents submit error:", error);
      toast.error(error?.message || "Some documents failed to submit.");
    },
  });

  const { mutate: updateDocumentFunc, isPending: isUpdating } = useMutation({
    mutationFn: async (userData: any[]) => {
      const errors: Record<string, string> = {};

      const responses = await Promise.allSettled(
        userData.map(async (document, index) => {
          try {
            const formData = new FormData();

            Object.entries(document).forEach(([key, value]) => {
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
              `/api/member/v1/members/documents/`,
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
        throw new Error("Some documents failed to update.");
      }

      return successfulData;
    },

    onSuccess: (dataArray) => {
      if (Array.isArray(dataArray) && dataArray.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["useGetMember", memberID] });
        toast.success("All document updated.");
      }
    },

    onError: (error: any) => {
      console.error("Documents update error:", error);
      toast.error(error?.message || "Some documents failed to update.");
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
              document_document: null as File | null,
              document_type: d?.document_type?.id?.toString() || "",
            })),
          }
        : {
            data: [
              {
                member_ID: memberID,
                document_document: null as File | null,
                document_type: "",
              },
            ],
          },
    validationSchema,
    onSubmit: (values) => {
      if (!memberID) {
        toast.error("Member ID not found");
        return;
      }
      if (isUpdateMode) {
        updateDocumentFunc(values.data);
      } else {
        addDocumentFunc(values.data);
      }
    },
  });

  const addDocument = () => {
    const newDocument = {
      member_ID: memberID,
      document_document: null as File | null,
      document_type: "",
    };
    const updatedDocuments = [...formik.values.data, newDocument];
    formik.setFieldValue("data", updatedDocuments);
  };
  const removeDocument = (index: number) => {
    if (formik.values.data.length > 1) {
      const updatedDocuments = formik.values.data.filter(
        (_: any, i: any) => i !== index
      );
      formik.setFieldValue("data", updatedDocuments);
    } else {
      toast.error("At least one document is required");
    }
  };

  const updateDocument = (index: number, field: string, value: any) => {
    formik.setFieldValue(`data.${index}.${field}`, value);
  };

  const handleFileUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      updateDocument(index, "document_document", file);
    }
  };

  //Button Functions
  const handleSkip = () => {
    nextStep();
  };

  const handleSaveAndExit = () => {
    setCurrentStep(0);
    setMemberID("");
    router.push("/");
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {formik.values.data.map((document: any, index: number) => {
          return (
            <div
              key={index}
              className="border rounded-lg p-4 space-y-4 relative"
            >
              {formik.values.data.length > 1 && (
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    Document {index + 1}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-1">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">
                      Upload Document
                    </Label>
                    <p className="text-sm text-gray-500 pr-5">
                      {isUpdateMode
                        ? memberData[index]?.document_document?.split("/").pop()
                        : null}
                    </p>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      ref={(el) => {
                        fileInputRefs.current[index] = el;
                      }}
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(event) => handleFileUpload(index, event)}
                      className="hidden"
                    />
                    {document.document_document ? (
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">
                          {document.document_document.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            updateDocument(index, "document_document", null);
                            console.log(`Removed document ${index} file`);
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
                          console.log(
                            `Clicked to upload document ${index} file`
                          );
                        }}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    )}
                  </div>

                  {(formik.touched.data as any[])?.[index]?.document_document &&
                    (formik.errors.data as any[])?.[index]
                      ?.document_document && (
                      <p className="text-sm text-red-600">
                        {
                          (formik.errors.data as any[])?.[index]
                            ?.document_document
                        }
                      </p>
                    )}
                </div>

                {/* Document Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Select Document Type
                  </Label>
                  <Select
                    value={document.document_type}
                    onValueChange={(value) =>
                      updateDocument(index, "document_type", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="What kind of document is this?">
                        {document_type?.find(
                          (c: any) =>
                            String(c.id) === String(document.document_type)
                        )?.name ?? "What kind of document is this?"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {document_type?.map((option: any) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {(formik.touched.data as any[])?.[index]?.document_type &&
                    (formik.errors.data as any[])?.[index]?.document_type && (
                      <p className="text-sm text-red-600">
                        {(formik.errors.data as any[])?.[index]?.document_type}
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
            onClick={addDocument}
            className="gap-2 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
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
            Exit
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
          {isPending || isUpdating ? "Saving..." : "Save & Next"}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
