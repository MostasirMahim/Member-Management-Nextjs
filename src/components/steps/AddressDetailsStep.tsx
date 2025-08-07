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
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

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
  } = useAddMemberStore();
  const { data: choiceSections, isLoading } = useGetAllChoice();
  const { address_type } = choiceSections ?? {};
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
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const data = {
        member_ID: memberID || "GM0001-PU",
        data: values.data,
      };
      addAddressFunc(data);
    },
  });

  const addAddress = () => {
    const newAddress = {
      address_type: "1111",
      address: "",
      is_primary: false,
    };
    const updatedAddresses = [...formik.values.data, newAddress];
    formik.setFieldValue("data", updatedAddresses);
  };

  const removeAddress = (index: number) => {
    if (formik.values.data.length > 1) {
      const updatedAddresses = formik.values.data.filter((_, i) => i !== index);
      formik.setFieldValue("data", updatedAddresses);
    } else {
      toast.error("At least one address is required");
    }
  };

  const updateAddress = (index: number, field: string, value: any) => {
    if (field === "is_primary" && value === true) {
      const updatedAddresses = formik.values.data.map((address, i) => ({
        ...address,
        is_primary: i === index ? true : false,
      }));
      formik.setFieldValue("data", updatedAddresses);
    } else {
      formik.setFieldValue(`data.${index}.${field}`, value);
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
        {formik.values.data.map((address: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-4 relative">
            {formik.values.data.length > 1 && (
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">
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
            )}
            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Address Type
                </Label>
                <Select
                  value={address.address_type}
                  onValueChange={(value) =>
                    updateAddress(index, "address_type", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="What kind of Address is this?"
                      children={
                        address_type?.find(
                          (c: any) =>
                            String(c.id) === String(address.address_type)
                        )?.name ?? "Select email type"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {address_type?.map((option: any) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {typeof formik.errors.data?.[index] === "object" &&
                  formik.errors.data?.[index]?.address_type &&
                  formik.touched.data?.[index]?.address_type && (
                    <p className="text-sm text-red-600">
                      {
                        (
                          formik.errors.data?.[index] as {
                            address_type?: string;
                          }
                        )?.address_type
                      }
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Address
                </Label>
                <Textarea
                  placeholder="Enter full address"
                  value={address.address}
                  onChange={(e) =>
                    updateAddress(index, "address", e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  name={`data.${index}.address`}
                  className="w-full min-h-[100px]"
                />
                {typeof formik.errors.data?.[index] === "object" &&
                  formik.errors.data?.[index]?.address &&
                  formik.touched.data?.[index]?.address && (
                    <p className="text-sm text-red-600">
                      {
                        (formik.errors.data?.[index] as { address?: string })
                          ?.address
                      }
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
                <Label className="text-sm font-medium text-gray-700">
                  Use as Primary
                </Label>
              </div>
            </div>
          </div>
        ))}
        {/* Add Another Button */}
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
          disabled={isPending}
          className="bg-black hover:bg-gray-800 text-white flex-1 sm:flex-none sm:min-w-[140px]"
        >
          {isPending ? "Saving..." : "Save & Next"}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
