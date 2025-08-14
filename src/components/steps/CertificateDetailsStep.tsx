"use client";
import type React from "react";
import { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X, Plus, Trash2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAddMemberStore } from "@/store/store";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // <CHANGE> Added useQueryClient
// <CHANGE> Added useGetMember import
import useGetMember from "@/hooks/data/useGetMember";

const validationSchema = Yup.object({
  data: Yup.array()
    .of(
      Yup.object({
        member_ID: Yup.string().required("Member ID is required"),
        title: Yup.string().required("Certificate title is required"),
        certificate_document: Yup.mixed().required(
          "Certificate document is required"
        ),
        certificate_number: Yup.string().required(
          "Certificate number is required"
        ),
      })
    )
    .min(1, "At least one certificate is required"),
});

export default function CertificateDetailsStep() {
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
  const { certificate: memberData } = data ?? {};

  const { mutate: addCertificateFunc, isPending } = useMutation({
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
              "/api/member/v1/members/certificate/",
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
        throw new Error("Some certificates failed to submit.");
      }

      return successfulData;
    },

    onSuccess: (dataArray) => {
      if (Array.isArray(dataArray) && dataArray.length > 0) {
        formik.resetForm();
        toast.success("All Certificates have been successfully added.");
        markStepCompleted(currentStep);
        nextStep();
      }
    },

    onError: (error: any) => {
      console.error("Certificate submit error:", error);
      toast.error(error?.message || "Some certificates failed to submit.");
    },
  });

  const { mutate: updateCertificateFunc, isPending: isUpdating } = useMutation({
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
              `/api/member/v1/members/certificate/`,
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
        throw new Error("Some certificates failed to update.");
      }

      return successfulData;
    },

    onSuccess: (dataArray) => {
      if (Array.isArray(dataArray) && dataArray.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["useGetMember", memberID] });
        toast.success("All Certificate updated.");
      }
    },

    onError: (error: any) => {
      console.error("Certificate update error:", error);
      toast.error(error?.message || "Some certificates failed to update.");
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      isUpdateMode && memberData && memberData?.length > 0
        ? {
            data: memberData?.map((c: any) => ({
              id: c?.id || 0,
              member_ID: memberID,
              title: c?.title || "",
              certificate_document: null as File | null,
              certificate_number: c?.certificate_number || "",
            })),
          }
        : {
            data: [
              {
                member_ID: memberID,
                title: "",
                certificate_document: null as File | null,
                certificate_number: "",
              },
            ],
          },
    validationSchema: isUpdateMode ? Yup.object({}) : validationSchema,
    onSubmit: (values) => {
      if (!memberID) {
        toast.error("Member ID not found");
        return;
      }
      if (isUpdateMode) {
        updateCertificateFunc(values.data);
      } else {
        addCertificateFunc(values.data);
      }
    },
  });

  const addCertificate = () => {
    const newCertificate = {
      member_ID: memberID,
      title: "",
      certificate_document: null as File | null,
      certificate_number: "",
    };
    const updatedCertificates = [...formik.values.data, newCertificate];
    formik.setFieldValue("data", updatedCertificates);
  };

  const removeCertificate = (index: number) => {
    if (formik.values.data.length > 1) {
      const updatedCertificates = formik.values.data.filter(
        (_: any, i: any) => i !== index
      );
      formik.setFieldValue("data", updatedCertificates);
    } else {
      toast.error("At least one certificate is required");
    }
  };

  const updateCertificate = (index: number, field: string, value: any) => {
    formik.setFieldValue(`data.${index}.${field}`, value);
  };

  const handleFileUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      updateCertificate(index, "certificate_document", file);
    } else {
      toast.error("No file selected");
    }
  };

  const removeFile = (index: number) => {
    updateCertificate(index, "certificate_document", null);
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = "";
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
        {formik.values.data.map((certificate: any, index: number) => {
          return (
            <div
              key={index}
              className="border rounded-lg p-4 space-y-4 relative"
            >
              {formik.values.data.length > 1 && (
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    Certificate {index + 1}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertificate(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-1">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Certificate Title
                  </Label>
                  <Input
                    placeholder="Enter Certificate Title"
                    value={certificate.title}
                    onChange={(e) =>
                      updateCertificate(index, "title", e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    name={`data.${index}.title`}
                    className="w-full"
                  />
                  {/* <CHANGE> Updated to use consistent touch/error pattern */}
                  {(formik.touched.data as any[])?.[index]?.title &&
                    (formik.errors.data as any[])?.[index]?.title && (
                      <p className="text-sm text-red-600">
                        {(formik.errors.data as any[])?.[index]?.title}
                      </p>
                    )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Upload Certificate
                  </Label>
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
                    {certificate.certificate_document ? (
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">
                          {certificate.certificate_document.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
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
                            `Clicked to upload certificate ${index} file`
                          );
                        }}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    )}
                  </div>
                  {/* <CHANGE> Updated to use consistent touch/error pattern */}
                  {(formik.touched.data as any[])?.[index]
                    ?.certificate_document &&
                    (formik.errors.data as any[])?.[index]
                      ?.certificate_document && (
                      <p className="text-sm text-red-600">
                        {
                          (formik.errors.data as any[])?.[index]
                            ?.certificate_document
                        }
                      </p>
                    )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Certificate Number
                  </Label>
                  <Input
                    placeholder="Enter Certificate Number"
                    value={certificate.certificate_number}
                    onChange={(e) =>
                      updateCertificate(
                        index,
                        "certificate_number",
                        e.target.value
                      )
                    }
                    onBlur={formik.handleBlur}
                    name={`data.${index}.certificate_number`}
                    className="w-full"
                  />
                  {/* <CHANGE> Updated to use consistent touch/error pattern */}
                  {(formik.touched.data as any[])?.[index]
                    ?.certificate_number &&
                    (formik.errors.data as any[])?.[index]
                      ?.certificate_number && (
                      <p className="text-sm text-red-600">
                        {
                          (formik.errors.data as any[])?.[index]
                            ?.certificate_number
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
            onClick={addCertificate}
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
          disabled={isPending || isUpdating} // <CHANGE> Added isUpdating to disabled state
          className="bg-black hover:bg-gray-800 text-white flex-1 sm:flex-none sm:min-w-[140px]"
        >
          {isPending || isUpdating ? "Saving..." : "Save & Next"}{" "}
          {/* <CHANGE> Added isUpdating check */}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
