"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Mails } from "lucide-react";
import { useForgetPassStore } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";


const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

function EmailStep() {
  const router = useRouter();
  const { email, setEmail, reset } = useForgetPassStore();
  const { mutate: sentOtp, isPending } = useMutation({
    mutationFn: async (email: string) => {
      const res = await axiosInstance.post("/api/account/v1/forget_password/", {
        email: email,
      });
      return res.data;
    },
    onSuccess: (data) => {
     if (data?.status === "success") {
        toast.success(data.message || "OTP sent successfully.");
        router.push("/forget-password/otp");
        formik.resetForm();
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, details } = error?.response.data;

      if (errors) {
         Object.entries(errors).forEach(([field, messages]) => {
          formik.setFieldError(
            field,
            Array.isArray(messages) ? messages[0] : messages
          );
        });
        
      } else {
        toast.error(details || message || "An error occurred during Added");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      email: email || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.email) {
        setEmail(values.email);
        sentOtp(values.email);
      }
    },
  });

  const handleCanel = () => {
    formik.resetForm();
    reset();
    router.push("/login");
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#edf3fc] dark:bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm min-h-[400px] rounded-lg shadow-lg flex justify-center  ">
        <CardContent className="p-8 space-y-6 w-full ">
          <div className="space-y-3 text-center">
            <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-blue-100 border-2 border-blue-200">
              <Mails className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold ">
              Reset Your <span className="text-primary">Password</span>
            </h1>
            <p className="text-sm text-gray-500">
              We will send you an OTP to reset password
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4 w-full ">
            <div className="space-y-2">
              <Label htmlFor="employeeEmail">Employee Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="m@example.com"
                type="email"
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
            <div className="flex gap-2">
              <Button
                onClick={handleCanel}
                variant={"outline"}
                className="w-full"
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Verifying..." : "Send OTP"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EmailStep;
