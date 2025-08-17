"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAddMemberStore } from "@/store/store";
import useGetAllChoice from "@/hooks/data/useGetAllChoice";
import useGetMember from "@/hooks/data/useGetMember";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoadingCard } from "../ui/loading";

const validationSchema = Yup.object({
  data: Yup.array()
    .of(
      Yup.object({
        email_type: Yup.number().required("Email type is required"),
        email: Yup.string()
          .email("Invalid email format")
          .required("Email address is required"),
        is_primary: Yup.boolean(),
      })
    )
    .min(1, "At least one email is required"),
});

const initialValues = {
  data: [
    {
      email_type: null,
      email: "",
      is_primary: false,
    },
  ],
};

export default function EmailDetailsStep() {
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

  const { data: choiceSections, isLoading } = useGetAllChoice();
  const { email_type } = choiceSections ?? {};

  const { data, isLoading: isLoadingMember } = useGetMember(memberID, {
    enabled: isUpdateMode && !!memberID,
  });
  const { email_address: memberData } = data ?? {};

  const { mutate: addEmailFunc, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.post(
        `/api/member/v1/members/email_address/`,
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["useGetMember", memberID] });
        toast.success(data.message || "Email has been successfully added.");
        markStepCompleted(currentStep);
        nextStep();
        formik.resetForm();
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

  const { mutate: updateEmailFunc, isPending: isUpdating } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.patch(
        `/api/member/v1/members/email_address/${memberID}/`,
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["useGetMember", memberID] });
        toast.success(data.message || "Email successfully updated.");
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      isUpdateMode && memberData && memberData?.length > 0
        ? {
            data: memberData?.map((email: any) => ({
              id: email?.id || 0,
              email_type: email?.email_type.id || 0,
              email: email?.email || "",
              is_primary: email?.is_primary || false,
            })),
          }
        : initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (!memberID) {
        toast.error("No Member ID found. Please start from member creation.");
        return;
      }
      const payload = { member_ID: memberID, data: values.data };
      if (isUpdateMode) {
        updateEmailFunc(payload);
      } else {
        addEmailFunc(payload);
      }
    },
  });

  const addEmail = () => {
    const newEmail = {
      email_type: 1111,
      email: "",
      is_primary: false,
    };
    formik.setFieldValue("data", [...formik.values.data, newEmail]);
  };

  const removeEmail = (index: number) => {
    if (formik.values.data.length > 1) {
      formik.setFieldValue(
        "data",
        formik.values.data.filter((_: any, i: any) => i !== index)
      );
    } else {
      toast.error("At least one email is required");
    }
  };

  const updateEmail = (index: number, field: string, value: any) => {
    if (field === "is_primary" && value === true) {
      formik.setFieldValue(
        "data",
        formik.values.data.map((email: any, i: any) => ({
          ...email,
          is_primary: i === index,
        }))
      );
    } else {
      formik.setFieldValue(`data.${index}.${field}`, value);
    }
  };
  
  const handleSkip = () => {
    nextStep();
  };

  const handleSaveAndExit = () => {
    setCurrentStep(0);
    setMemberID("");
    router.push("/");
  };

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {formik.values.data.map((email: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-4 relative">
            {formik.values.data.length > 1 && (
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">
                  Email {index + 1}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEmail(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Email Type
                </Label>
                <Select
                  value={email.email_type}
                  onValueChange={(value) =>
                    updateEmail(index, "email_type", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="What kind of Email is this?"
                      children={
                        email_type?.find(
                          (c: any) => String(c.id) === String(email.email_type)
                        )?.name ?? "Select email type"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {email_type?.map((option: any, ind: number) => (
                      <SelectItem key={ind} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(formik.touched.data as any[])?.[index]?.email_type &&
                  (formik.errors.data as any[])?.[index]?.email_type && (
                    <p className="text-sm text-red-600">
                      {(formik.errors.data as any[])?.[index]?.email_type}
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email.email}
                  onChange={(e) => updateEmail(index, "email", e.target.value)}
                  onBlur={formik.handleBlur}
                  name={`data.${index}.email`}
                  className="w-full"
                />
                {(formik.touched.data as any[])?.[index]?.email &&
                  (formik.errors.data as any[])?.[index]?.email && (
                    <p className="text-sm text-red-600">
                      {(formik.errors.data as any[])?.[index]?.email}
                    </p>
                  )}
              </div>
              <div className="flex items-center space-x-3">
                <Switch
                  checked={email.is_primary}
                  onCheckedChange={(checked) =>
                    updateEmail(index, "is_primary", checked)
                  }
                />
                <Label className="text-sm font-medium text-gray-700">
                  Use as Primary
                </Label>
              </div>
            </div>
          </div>
        ))}
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEmail}
            className="gap-2 bg-transparent"
          >
            <Plus className="w-4 h-4" />
            Add Emails
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
        <div className="flex gap-3 flex-1">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveAndExit}
            className="flex-1 sm:flex-none bg-transparent"
          >
            Exit
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            className="flex-1 sm:flex-none"
          >
            Skip
          </Button>
        </div>
        <Button
          type="submit"
          disabled={isPending || isUpdating} // 🆕 disable during update
          className="bg-black hover:bg-gray-800 text-white flex-1 sm:flex-none sm:min-w-[140px]"
        >
          {isPending || isUpdating ? "Saving..." : "Save & Next"}{" "}
          {/* 🆕 show Saving on update */}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
