"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IdCardIcon } from "lucide-react";
import { useRegUserStore } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

function OnboardingStep1() {
  const router = useRouter();
  const { setEmail } = useRegUserStore();


  const { mutate: sentRegOtp, isPending } = useMutation({
    mutationFn: async (email: string) => {
      const res = await axiosInstance.post(
        "/api/account/v1/authorization/admin_user_email/",
        { email }
      );
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "OTP sent successfully.");
      router.push("/registration/otp");
      formik.resetForm();
    },
    onError: (error: any) => {
      console.error("Error :", error);
      const { message, errors, details } = error?.response.data;

      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          formik.setFieldError(
            field,
            Array.isArray(messages) ? messages[0] : messages
          );
        });
      } else {
        toast.error(message || "An error occurred");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.email) {
        setEmail(values.email);
        sentRegOtp(values.email);
      }
    },
  });
  return (
    <div className="flex items-center justify-center   px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md min-h-[400px] rounded-lg shadow-lg flex justify-center  ">
        <CardContent className="p-8 space-y-6 w-full ">
          <div className="space-y-3 text-center">
            <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-blue-100 border-2 border-blue-200">
              <IdCardIcon className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold ">
              Add an <span className="text-primary">Employee</span>
            </h1>
            <p className="text-sm text-gray-500">
              An OTP will be sent to this email for verify
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4 w-full ">
            <div className="space-y-2">
              <Label htmlFor="email">New Employee Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="m@example.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-xs pl-3">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <Button
              className="w-full  bg-blue-600 hover:bg-blue-700 text-white"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default OnboardingStep1;
