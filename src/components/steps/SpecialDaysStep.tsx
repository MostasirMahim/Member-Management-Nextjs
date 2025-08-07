"use client";
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
import { CalendarIcon, ChevronRight, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAddMemberStore } from "@/store/store";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

const validationSchema = Yup.object({
  data: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().required("Special day title is required"),
        date: Yup.date().required("Special day date is required"),
      })
    )
    .min(1, "At least one special day is required"),
});

const initialValues = {
  data: [
    {
      title: "",
      date: null as Date | null,
    },
  ],
};

export default function SpecialDaysStep() {
  const router = useRouter();
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    markStepCompleted,
    memberID,
    setMemberID,
  } = useAddMemberStore();

  const { mutate: addSpecialDayFunc, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.post(
        `/api/member/v1/members/special_day/`,
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        formik.resetForm();
        toast.success(data.message || "Email has been successfully added.");
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
      console.log("Special Days Form submitted:", values);
      const data = {
        member_ID: memberID || "GM0001-PU",
        data: values.data,
      };
      addSpecialDayFunc(data);
    },
  });

  const addSpecialDay = () => {
    const newSpecialDay = {
      title: "",
      date: null as Date | null,
    };
    const updatedSpecialDays = [...formik.values.data, newSpecialDay];
    formik.setFieldValue("data", updatedSpecialDays);
  };

  const removeSpecialDay = (index: number) => {
    if (formik.values.data.length > 1) {
      const updatedSpecialDays = formik.values.data.filter(
        (_, i) => i !== index
      );
      formik.setFieldValue("data", updatedSpecialDays);
    } else {
      toast.error("At least one special day is required");
    }
  };

  const updateSpecialDay = (index: number, field: string, value: any) => {
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
        {formik.values.data.map((specialDay: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-4 relative">
            {formik.values.data.length > 1 && (
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">
                  Special Day {index + 1}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSpecialDay(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Special Day Title
                </Label>
                <Input
                  placeholder="Special Day Name"
                  value={specialDay.title}
                  onChange={(e) =>
                    updateSpecialDay(index, "title", e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  name={`data.${index}.title`}
                  className="w-full"
                />
                {typeof formik.errors.data?.[index] === "object" &&
                  formik.errors.data?.[index]?.title &&
                  formik.touched.data?.[index]?.title && (
                    <p className="text-sm text-red-600">
                      {formik.errors.data[index].title}
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Select Special Day
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !specialDay.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {specialDay.date
                        ? format(specialDay.date, "PPP")
                        : "Choose date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        formik.values.data[index].date
                          ? new Date(formik.values.data[index].date)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const formattedDate = format(date, "yyyy-MM-dd");
                          updateSpecialDay(index, "date", formattedDate);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {typeof formik.errors.data?.[index] === "object" &&
                  formik.errors.data?.[index]?.date &&
                  formik.touched.data?.[index]?.date && (
                    <p className="text-sm text-red-600">
                      {formik.errors.data[index].date as string}
                    </p>
                  )}
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
            onClick={addSpecialDay}
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
