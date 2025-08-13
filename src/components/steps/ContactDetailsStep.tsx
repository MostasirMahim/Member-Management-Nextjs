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
import useGetAllChoice from "@/hooks/data/useGetAllChoice";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAddMemberStore } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useGetMember from "@/hooks/data/useGetMember";

const validationSchema = Yup.object({
  contacts: Yup.array()
    .of(
      Yup.object({
        contact_type: Yup.string().required("Contact type is required"),
        number: Yup.string().required("Contact number is required"),
        is_primary: Yup.boolean(),
      })
    )
    .min(1, "At least one contact is required"),
});

export default function ContactDetailsStep() {
  const router = useRouter();
  const path = usePathname();
  const isUpdateMode = path?.startsWith("/member/update/");
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    markStepCompleted,
    memberID,
    setMemberID,
  } = useAddMemberStore();
  const { data: choiceSections, isLoading } = useGetAllChoice();
  const { contact_type } = choiceSections ?? {};

  const { data, isLoading: isLoadingMember } = useGetMember(memberID);
  const { contact_info: memberData } = data ?? {};

  const querClient = useQueryClient();

  const { mutate: addContactFunc, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.post(
        `/api/member/v1/members/contact_numbers/`,
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        querClient.invalidateQueries({ queryKey: ["useGetMember", memberID] });
        toast.success(data.message || "Contact has been successfully added.");
        formik.resetForm();
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
                const fieldPath = `contacts.${contactIndex}.${fieldName}`;
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
  const { mutate: updateContactFunc, isPending: isUpdating } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.patch(
        `/api/member/v1/members/contact_numbers/${memberID}/`,
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        console.log(data);
        querClient.invalidateQueries({ queryKey: ["useGetMember", memberID] });
        toast.success(data.message || "Contact has been successfully updated.");
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
                const fieldPath = `contacts.${contactIndex}.${fieldName}`;
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
      isUpdateMode && memberData
        ? {
            contacts: memberData?.map((memberData: any) => ({
              id: memberData.id,
              contact_type: memberData.contact_type?.id || "",
              number: memberData.number || "",
              is_primary: memberData.is_primary || false,
            })),
          }
        : {
            contacts: [
              {
                contact_type: "",
                number: "",
                is_primary: false,
              },
            ],
          },
    validationSchema,
    onSubmit: (values) => {
      if (!memberID) {
        toast.error("Member ID not found");
        return;
      }
      const data = {
        member_ID: memberID,
        data: values.contacts,
      };
      if (isUpdateMode) {
        console.log("update", data);
        updateContactFunc(data);
      } else {
        addContactFunc(data);
      }
    },
  });

  const addContact = () => {
    const newContact = {
      contact_type: "",
      number: "",
      is_primary: false,
    };
    const updatedContacts = [...formik.values.contacts, newContact];
    formik.setFieldValue("contacts", updatedContacts);
  };

  const removeContact = (index: number) => {
    if (formik.values.contacts.length > 1) {
      const updatedContacts = formik.values.contacts.filter(
        (_: any, i: any) => i !== index
      );
      formik.setFieldValue("contacts", updatedContacts);
    } else {
      toast.error("At least one contact is required");
    }
  };

  const updateContact = (index: number, field: string, value: any) => {
    formik.setFieldValue(`contacts.${index}.${field}`, value);
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
        {formik.values.contacts.map((contact: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-4 relative">
            {formik.values.contacts.length > 1 && (
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">
                  Contact {index + 1}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContact(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Contact Type
                </Label>
                <Select
                  value={contact.contact_type}
                  onValueChange={(value) =>
                    updateContact(index, "contact_type", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="What kind of contact is this?"
                      children={
                        contact_type?.find(
                          (c: any) =>
                            String(c.id) === String(contact.contact_type)
                        )?.name ?? "What kind of contact is this?"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {contact_type?.map((choice: any, ind: number) => (
                      <SelectItem key={ind} value={choice.id}>
                        {choice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(formik.touched.contacts as any[])?.[index]?.contact_type &&
                  (formik.errors.contacts as any[])?.[index]?.contact_type
                    ?.name && (
                    <p className="text-sm text-red-600">
                      {
                        (formik.errors.contacts as any[])?.[index]?.contact_type
                          ?.name
                      }
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Contact Number
                </Label>
                <Input
                  type="tel"
                  placeholder="Enter contact number"
                  value={contact.number}
                  onChange={(e) =>
                    updateContact(index, "number", e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  name={`contacts.${index}.number`}
                  className="w-full"
                />
                {(formik.touched.contacts as any[])?.[index]?.number &&
                  (formik.errors.contacts as any[])?.[index]?.number && (
                    <p className="text-sm text-red-600">
                      {(formik.errors.contacts as any[])?.[index]?.number}
                    </p>
                  )}
              </div>
              <div className="flex items-center space-x-3">
                <Switch
                  checked={contact.is_primary}
                  onCheckedChange={(checked) =>
                    updateContact(index, "is_primary", checked)
                  }
                  disabled={formik.values.contacts.some(
                    (c: any, i: any) => c.is_primary && i !== index
                  )}
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
            onClick={addContact}
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
