"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAddMemberStore } from "@/store/store";

const validationSchema = Yup.object({
  data: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().required("Job title is required"),
        organization_name: Yup.string().required(
          "Organization name is required"
        ),
        location: Yup.string().required("Location is required"),
      })
    )
    .min(1, "At least one job detail is required"),
});

const initialValues = {
  data: [
    {
      title: "",
      organization_name: "",
      location: "",
    },
  ],
};

export default function JobDetailsStep() {
  const router = useRouter();
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    markStepCompleted,
    memberID,
    setMemberID,
  } = useAddMemberStore();

  const { mutate: addJobDetailsFunc, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.post(
        `/api/member/v1/members/job/`,
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        formik.resetForm();
        toast.success(data.message || "Job Detail has been added.");
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
      addJobDetailsFunc(data);
    },
  });

  const addJob = () => {
    const newJob = {
      title: "",
      organization_name: "",
      location: "",
    };
    const updatedJobs = [...formik.values.data, newJob];
    formik.setFieldValue("data", updatedJobs);
  };

  const removeJob = (index: number) => {
    if (formik.values.data.length > 1) {
      const updatedJobs = formik.values.data.filter((_, i) => i !== index);
      formik.setFieldValue("data", updatedJobs);
    } else {
      toast.error("At least one job detail is required");
    }
  };

  const updateJob = (index: number, field: string, value: any) => {
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
        {formik.values.data.map((job: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-4 relative">
            {formik.values.data.length > 1 && (
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">
                  Job Detail {index + 1}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeJob(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-1">
              {/* Job Title */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Job Title
                </Label>
                <Input
                  placeholder="Enter Job Title"
                  value={job.title}
                  onChange={(e) => updateJob(index, "title", e.target.value)}
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

              {/* Organization Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Organization Name
                </Label>
                <Input
                  placeholder="Enter Organization Name"
                  value={job.organization_name}
                  onChange={(e) =>
                    updateJob(index, "organization_name", e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  name={`data.${index}.organization_name`}
                  className="w-full"
                />
                {typeof formik.errors.data?.[index] === "object" &&
                  formik.errors.data?.[index]?.organization_name &&
                  formik.touched.data?.[index]?.organization_name && (
                    <p className="text-sm text-red-600">
                      {formik.errors.data[index].organization_name}
                    </p>
                  )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Location
                </Label>
                <Input
                  placeholder="Enter Location"
                  value={job.location}
                  onChange={(e) => updateJob(index, "location", e.target.value)}
                  onBlur={formik.handleBlur}
                  name={`data.${index}.location`}
                  className="w-full"
                />
                {typeof formik.errors.data?.[index] === "object" &&
                  formik.errors.data?.[index]?.location &&
                  formik.touched.data?.[index]?.location && (
                    <p className="text-sm text-red-600">
                      {formik.errors.data[index].location}
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
            onClick={addJob}
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
