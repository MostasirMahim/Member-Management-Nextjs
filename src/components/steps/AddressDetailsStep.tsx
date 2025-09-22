"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import useGetMember from "@/hooks/data/useGetMember"; // added

const validationSchema = Yup.object({
  data: Yup.array()
    .of(
      Yup.object({
        address_type: Yup.number().required("Address type is required"),
        address: Yup.string().required("Address is required"),
        is_primary: Yup.boolean(),
      })
    )
    .min(1, "At least one address is required"),
});

const initialValues = {
  data: [
    {
      address_type: "",
      address: "",
      is_primary: false,
    },
  ],
};

export default function AddressDetailsStep() {
  const router = useRouter();
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    markStepCompleted,
    memberID,
    setMemberID,
    isUpdateMode,
  } = useAddMemberStore();

  const { data: choiceSections } = useGetAllChoice();
  const { address_type } = choiceSections ?? {};
  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingMember } = useGetMember(memberID, {
    enabled: isUpdateMode && !!memberID,
  });
  const { address: memberData } = data ?? {};

  const { mutate: addAddressFunc, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.post(
        `/api/member/v1/members/address/`,
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        formik.resetForm();
        toast.success(data.message || "Address has been successfully added.");
        markStepCompleted(currentStep);
        nextStep();
      }
    },
    onError: handleError,
  });

  const { mutate: updateAddressFunc, isPending: isUpdating } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.patch(
        `/api/member/v1/members/address/${memberID}/`,
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["useGetMember", memberID] });
        toast.success(data.message || "Address has been successfully updated.");
        markStepCompleted(currentStep);
        nextStep();
      }
    },
    onError: handleError,
  });
  const { mutate: deleteAddressFunc, isPending: isDeleting } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.delete(
        `/api/member/v1/members/address/${memberID}/`,
        { data: userData }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["useGetMember", memberID] });
        toast.success(data.message || "Address has been successfully deleted.");
      }
    },
    onError: handleError,
  });

  function handleError(error: any) {
    console.log("error", error?.response);
    const { message, errors, detail } = error?.response?.data || {};
    if (errors?.data && Array.isArray(errors.data)) {
      const contactsErrors = errors.data;
      contactsErrors.forEach((contactErrorObj: any, contactIndex: number) => {
        if (contactErrorObj && typeof contactErrorObj === "object") {
          for (const [fieldName, messages] of Object.entries(contactErrorObj)) {
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
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      isUpdateMode && memberData && memberData?.length > 0
        ? {
            data: memberData?.map((addr: any) => ({
              id: addr.id || 0,
              address_type: addr.address_type.id || 0,
              address: addr.address || "",
              is_primary: addr.is_primary || false,
            })),
          }
        : initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (!memberID) {
        toast.error("No Member ID found.");
        return;
      }
      const data = {
        member_ID: memberID,
        data: values.data,
      };
      if (isUpdateMode) {
        updateAddressFunc(data);
      } else {
        addAddressFunc(data);
      }
    },
  });

  const addAddress = () => {
    const newAddress = {
      address_type: "",
      address: "",
      is_primary: false,
    };
    formik.setFieldValue("data", [...formik.values.data, newAddress]);
  };

  const removeAddress = (index: number) => {
    const data = formik.values.data[index];
    if (!data?.id) {
      const updated = formik.values.data.filter(
        (_: any, i: any) => i !== index
      );
      formik.setFieldValue("data", updated);
      return;
    }

    deleteAddressFunc({ id: data.id });
  };

  const updateAddress = (index: number, field: string, value: any) => {
    if (field === "is_primary" && value === true) {
      formik.setFieldValue(
        "data",
        formik.values.data.map((address: any, i: any) => ({
          ...address,
          is_primary: i === index,
        }))
      );
    } else {
      formik.setFieldValue(`data.${index}.${field}`, value);
    }
  };

  const handleSkip = () => nextStep();
  const handleSaveAndExit = () => {
    formik.resetForm();
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {formik.values.data.map((address: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-4 relative">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-primary">
                  Address {index + 1}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAddress(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Label>Address Type</Label>
                <Select
                  value={String(address.address_type)}
                  onValueChange={(value) =>
                    updateAddress(index, "address_type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder="What kind of Address is this?"
                      children={
                        address_type?.find(
                          (c: any) =>
                            String(c.id) === String(address.address_type)
                        )?.name ?? "Select address type"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {address_type?.map((option: any) => (
                      <SelectItem key={option.id} value={String(option.id)}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(formik.touched.data as any[])?.[index]?.address_type &&
                  (formik.errors.data as any[])?.[index]?.address_type && (
                    <p className="text-sm text-red-600">
                      {(formik.errors.data as any[])?.[index]?.address_type}
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  placeholder="Enter full address"
                  value={address.address}
                  onChange={(e) =>
                    updateAddress(index, "address", e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  name={`data.${index}.address`}
                />
                {(formik.touched.data as any[])?.[index]?.address &&
                  (formik.errors.data as any[])?.[index]?.address && (
                    <p className="text-sm text-red-600">
                      {(formik.errors.data as any[])?.[index]?.address}
                    </p>
                  )}
              </div>
              <div className="flex items-center space-x-3">
                <Switch
                  checked={address.is_primary}
                  onCheckedChange={(checked) =>
                    updateAddress(index, "is_primary", checked)
                  }
                />
                <Label>Use as Primary</Label>
              </div>
            </div>
          </div>
        ))}
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAddress}
            className="gap-2 bg-transparent"
          >
            <Plus className="w-4 h-4" />
            Add Addresses
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
        <div className="flex gap-3 flex-1">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveAndExit}
            className="flex-1 sm:flex-none"
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
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
          {isPending || isUpdating ? "Saving..." : "Save & Next"}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
