"use client";
import type React from "react";
import { useRef } from "react";
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
import { CalendarIcon, ChevronRight, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import useGetAllChoice from "@/hooks/data/useGetAllChoice";
import { useAddMemberStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { se } from "date-fns/locale";

const validationSchema = Yup.object({
  spouse_name: Yup.string().required("Spouse name is required"),
  contact_number: Yup.string().required("Contact number is required"),
  spouse_dob: Yup.date().required("Spouse date of birth is required"),
  image: Yup.mixed().nullable().required("Profile picture is required"),
  current_status: Yup.string().required("Current status is required"),
});

const initialValues = {
  member_ID: "",
  spouse_name: "",
  contact_number: "",
  spouse_dob: null as Date | null,
  image: null as File | null,
  current_status: "",
};

export default function SpouseDetailsStep() {
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const { spouse_status_choice } = choiceSections ?? {};

  const { mutate: addSpouseFunc, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value as any);
      });

      const res = await axiosInstance.post(
        `/api/member/v1/members/spouse/`,
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
        toast.success(data.message || "Spouse has been successfully added.");
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
          }
        }
        toast.error("Submission Failed");
      } else {
        toast.error(detail || message || "Submission Failed");
      }
    },
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      values.member_ID = memberID || "GM0001-PU";
      if (values.member_ID) {
        addSpouseFunc(values);
      }
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue("image", file);
    } else {
      toast.error("No file selected");
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
    setCurrentStep(0);
    setMemberID("");
    router.push("/");
  };
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <Label
            htmlFor="spouse_name"
            className="text-sm font-medium text-gray-700"
          >
            Spouse Name
          </Label>
          <Input
            id="spouse_name"
            name="spouse_name"
            value={formik.values.spouse_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Spouse Name"
            className="w-full"
          />
          {formik.errors.spouse_name && formik.touched.spouse_name && (
            <p className="text-sm text-red-600">{formik.errors.spouse_name}</p>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <Label
            htmlFor="contact_number"
            className="text-sm font-medium text-gray-700"
          >
            Contact Number
          </Label>
          <Input
            id="contact_number"
            name="contact_number"
            type="tel"
            value={formik.values.contact_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Spouse Contact"
            className="w-full"
          />
          {formik.errors.contact_number && formik.touched.contact_number && (
            <p className="text-sm text-red-600">
              {formik.errors.contact_number}
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
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
                  !formik.values.spouse_dob && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formik.values.spouse_dob
                  ? format(formik.values.spouse_dob, "PPP")
                  : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  formik.values.spouse_dob
                    ? new Date(formik.values.spouse_dob)
                    : undefined
                }
                onSelect={(date) => {
                  if (date) {
                    const formattedDate = format(date, "yyyy-MM-dd");
                    formik.setFieldValue("spouse_dob", formattedDate);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {formik.errors.spouse_dob &&
            formik.touched.spouse_dob &&
            typeof formik.errors.spouse_dob === "string" && (
              <p className="text-sm text-red-600">{formik.errors.spouse_dob}</p>
            )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Status</Label>
          <Select
            value={formik.values.current_status}
            onValueChange={(value) => updateField("current_status", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="What is the spouse status?">
                {
                  spouse_status_choice?.find(
                    (c: any) =>
                      String(c.id) === String(formik.values.current_status)
                  )?.name
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {spouse_status_choice?.map((option: any) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.errors.current_status && formik.touched.current_status && (
            <p className="text-sm text-red-600">
              {formik.errors.current_status}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Spouse Picture
        </Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          {formik.values.image ? (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-700">
                {formik.values.image.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  updateField("image", null);
                  console.log("Removed spouse picture");
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
                fileInputRef.current?.click();
                console.log("Clicked to upload spouse picture");
              }}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          )}
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
