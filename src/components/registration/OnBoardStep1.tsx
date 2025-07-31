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
import { toast } from "@/hooks/use-toast";

const validationSchema = Yup.object({
  employeeEmail: Yup.string()
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
      console.log("OTP sent successfully:", data);
      toast({
        title: data.details || "OTP Sent",
        description: data.message || "Check your email for the OTP code.",
        variant: "default",
      });
      router.push("/registration/otp");
      formik.resetForm();
    },
    onError: (error: any) => {
      console.error("Error Post Creaion:", error);
      const { message, errors, details } = error?.response.data;

      if (errors) {
        const allErrors = Object.values(errors).flat().join("\n");
        toast({
          title: details || "Login Failed",
          description: allErrors,
          variant: "destructive",
        });
      } else {
        toast({
          title: details || "Login Failed",
          description: message || "An error occurred during login",
          variant: "destructive",
        });
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      employeeEmail: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.employeeEmail) {
        setEmail(values.employeeEmail);
        sentRegOtp(values.employeeEmail);
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
              Add an <span className="text-primary">employee</span>
            </h1>
            <p className="text-sm text-gray-500">
              An OTP will be sent to this email for verify
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4 w-full ">
            <div className="space-y-2">
              <Label htmlFor="employeeEmail">New employee Email</Label>
              <Input
                id="employeeEmail"
                name="employeeEmail"
                placeholder="m@example.com"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.employeeEmail}
                className={
                  formik.touched.employeeEmail && formik.errors.employeeEmail
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.employeeEmail && formik.errors.employeeEmail ? (
                <div className="text-red-500 text-xs pl-3">
                  {formik.errors.employeeEmail}
                </div>
              ) : null}
            </div>
            <Button
              className="w-full  bg-blue-600 hover:bg-blue-700 text-white"
              type="submit"
              disabled={false}
            >
              {false ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default OnboardingStep1;
