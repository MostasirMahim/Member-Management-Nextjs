"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAddMemberStore } from "@/store/store";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetMember from "@/hooks/data/useGetMember";

const validationSchema = Yup.object({
  data: Yup.array()
    .of(
      Yup.object({
        contact_name: Yup.string().required("Contact name is required"),
        contact_number: Yup.string().required("Contact number is required"),
        relation_with_member: Yup.string().required(
          "Relation with member is required"
        ),
      })
    )
    .min(1, "At least one emergency contact is required"),
});

const initialValues = {
  data: [
    {
      contact_name: "",
      contact_number: "",
      relation_with_member: "",
    },
  ],
};

export default function EmergencyContactStep() {
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
  const { emergency_contact: memberData } = data ?? {};

  const { mutate: addEmergencyContactFunc, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.post(
        `/api/member/v1/members/emergency_contact/`,
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        formik.resetForm();
        toast.success(
          data.message || "Emergency Contact has been successfully added."
        );
        markStepCompleted(currentStep);
        nextStep();
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response?.data || {};
      if (errors?.data && Array.isArray(errors.data)) {
        const contactsErrors = errors.data;
        contactsErrors.forEach((contactErrorObj: any, contactIndex: number) => {
          if (contactErrorObj && typeof contactErrorObj === "object") {
            for (const [fieldName, messages] of Object.entries(
              contactErrorObj
            )) {
              if (Array.isArray(messages) && messages.length > 0) {
                const fieldPath = `data.${contactIndex}.${fieldName}`;
                formik.setFieldError(fieldPath, messages[0]);
              }
            }
          }
        });
      }
      if (errors && typeof errors === "object") {
        const otherErrorKeys = Object.keys(errors).filter(
          (key) => key !== "data"
        );

        if (otherErrorKeys.length > 0) {
          const firstKey = otherErrorKeys[0];
          const messages = errors[firstKey];

          if (Array.isArray(messages) && messages.length > 0) {
            toast.error(messages[0]);
            return;
          }
        }
      }

      toast.error(detail || message || "Submission Failed");
    },
  });

  const { mutate: updateEmergencyContactFunc, isPending: isUpdating } =
    useMutation({
      mutationFn: async (userData: any) => {
        const res = await axiosInstance.patch(
          `/api/member/v1/members/emergency_contact/${memberID}/`,
          userData
        );
        return res.data;
      },
      onSuccess: (data) => {
        if (data?.status === "success") {
          queryClient.invalidateQueries({
            queryKey: ["useGetMember", memberID],
          });
          toast.success(
            data.message || "Emergency Contact has been successfully updated."
          );
        }
      },
      onError: (error: any) => {
        console.log("error", error?.response);
        const { message, errors, detail } = error?.response?.data || {};
        if (errors?.data && Array.isArray(errors.data)) {
          const contactsErrors = errors.data;
          contactsErrors.forEach(
            (contactErrorObj: any, contactIndex: number) => {
              if (contactErrorObj && typeof contactErrorObj === "object") {
                for (const [fieldName, messages] of Object.entries(
                  contactErrorObj
                )) {
                  if (Array.isArray(messages) && messages.length > 0) {
                    const fieldPath = `data.${contactIndex}.${fieldName}`;
                    formik.setFieldError(fieldPath, messages[0]);
                  }
                }
              }
            }
          );
        }
        if (errors && typeof errors === "object") {
          const otherErrorKeys = Object.keys(errors).filter(
            (key) => key !== "data"
          );

          if (otherErrorKeys.length > 0) {
            const firstKey = otherErrorKeys[0];
            const messages = errors[firstKey];

            if (Array.isArray(messages) && messages.length > 0) {
              toast.error(messages[0]);
              return;
            }
          }
        }

        toast.error(detail || message || "Submission Failed");
      },
    });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      isUpdateMode && memberData && memberData?.length > 0
        ? {
            data: memberData?.map((c: any) => ({
              id: c?.id || 0,
              contact_name: c?.contact_name || "",
              contact_number: c?.contact_number || "",
              relation_with_member: c?.relation_with_member || "",
            })),
          }
        : initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (!memberID) {
        toast.error("No Member ID found. Please start from member creation.");
        return;
      }
      const data = {
        member_ID: memberID,
        data: values.data,
      };
      if (isUpdateMode) {
        updateEmergencyContactFunc(data);
      } else {
        addEmergencyContactFunc(data);
      }
    },
  });

  const addEmergencyContact = () => {
    const newContact = {
      contact_name: "",
      contact_number: "",
      relation_with_member: "",
    };
    const updatedContacts = [...formik.values.data, newContact];
    formik.setFieldValue("data", updatedContacts);
  };

  const removeEmergencyContact = (index: number) => {
    if (formik.values.data.length > 1) {
      const updatedContacts = formik.values.data.filter(
        (_: any, i: any) => i !== index
      );
      formik.setFieldValue("data", updatedContacts);
    } else {
      toast.error("At least one emergency contact is required");
    }
  };

  const updateEmergencyContact = (index: number, field: string, value: any) => {
    formik.setFieldValue(`data.${index}.${field}`, value);
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
        {formik.values.data.map((contact: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-4 relative">
            {formik.values.data.length > 1 && (
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">
                  Emergency Contact {index + 1}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEmergencyContact(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="grid gap-6 md:grid-cols-1">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Contact Name
                </Label>
                <Input
                  placeholder="Enter Emergency Contact Name"
                  value={contact.contact_name}
                  onChange={(e) =>
                    updateEmergencyContact(
                      index,
                      "contact_name",
                      e.target.value
                    )
                  }
                  onBlur={formik.handleBlur}
                  name={`data.${index}.contact_name`}
                  className="w-full"
                />
                {(formik.touched.data as any[])?.[index]?.contact_name &&
                  (formik.errors.data as any[])?.[index]?.contact_name && (
                    <p className="text-sm text-red-600">
                      {(formik.errors.data as any[])?.[index]?.contact_name}
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Contact Number
                </Label>
                <Input
                  type="tel"
                  placeholder="Enter Emergency Contact"
                  value={contact.contact_number}
                  onChange={(e) =>
                    updateEmergencyContact(
                      index,
                      "contact_number",
                      e.target.value
                    )
                  }
                  onBlur={formik.handleBlur}
                  name={`data.${index}.contact_number`}
                  className="w-full"
                />
                {(formik.touched.data as any[])?.[index]?.contact_number &&
                  (formik.errors.data as any[])?.[index]?.contact_number && (
                    <p className="text-sm text-red-600">
                      {(formik.errors.data as any[])?.[index]?.contact_number}
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Relation With Member
                </Label>
                <Input
                  placeholder="Enter Relation With Member"
                  value={contact.relation_with_member}
                  onChange={(e) =>
                    updateEmergencyContact(
                      index,
                      "relation_with_member",
                      e.target.value
                    )
                  }
                  onBlur={formik.handleBlur}
                  name={`data.${index}.relation_with_member`}
                  className="w-full"
                />
                {(formik.touched.data as any[])?.[index]
                  ?.relation_with_member &&
                  (formik.errors.data as any[])?.[index]
                    ?.relation_with_member && (
                    <p className="text-sm text-red-600">
                      {
                        (formik.errors.data as any[])?.[index]
                          ?.relation_with_member
                      }
                    </p>
                  )}
              </div>
            </div>
          </div>
        ))}

        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEmergencyContact}
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
