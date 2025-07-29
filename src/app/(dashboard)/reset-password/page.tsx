"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react"; // To manage success state
import { Eye, EyeOff, PartyPopper } from "lucide-react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { changePass } from "@/actions/authentication/actions";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

const validationSchema = Yup.object({
  currentPassword: Yup.string()
    .required("Current Password is required")
    .min(8, "Password must be at least 8 characters"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm New Password is required"),
});

interface ResetPass {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
export default function ResetPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const router = useRouter();

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: async (userPass: ResetPass) => {
      const res = await await axiosInstance.patch(
        "/api/account/v1/reset_password/",
        userPass
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        setIsSuccess(true);
        toast({
          title: data?.details || "Password Changed",
          description:
            data?.message || "Your password has been successfully changed.",
          variant: "default",
        });
        formik.resetForm();
      }
    },
    onError: (error: any) => {
      const { message, errors, details } = error?.response.data;

      if (errors) {
        const allErrors = Object.values(errors).flat().join("\n");
        toast({
          title: "Login Failed",
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
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.newPassword === values.confirmPassword) {
        resetPassword({
          current_password: values.currentPassword,
          new_password: values.newPassword,
          confirm_password: values.confirmPassword,
        });
      }
    },
  });

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-sm min-h-[400px] rounded-lg shadow-lg flex justify-center items-center">
          <CardContent className="p-8 space-y-6 text-center  w-full">
            <div className="space-y-3 text-center w-full ">
              <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-blue-100 border-2 border-blue-200">
                <PartyPopper className="w-12 h-12 text-blue-600" />
              </div>

              <h1 className="text-2xl font-bold">
                Welcome <span className="text-blue-600">Mahim</span>
              </h1>
              <p className="text-gray-700 text-sm">
                Your password has been successfully updated.
              </p>
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push("/")}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex  items-center justify-center">
      <Card className="w-full max-w-sm rounded-lg shadow-lg">
        <CardContent className="py-6 px-8  space-y-5">
          <div className="flex flex-col items-center space-y-4">
            {/* Using a placeholder for the logo, similar to the login form */}
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-blue-600"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">Set New Password</h1>
              <p className="text-sm text-gray-500">
                Enter your new password below
              </p>
            </div>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  placeholder="Enter your new password"
                  type={showCurrentPassword ? "text" : "password"} // Dynamic type
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.currentPassword}
                  className={
                    formik.touched.currentPassword &&
                    formik.errors.currentPassword
                      ? "border-red-500 pr-10"
                      : "pr-10"
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showCurrentPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {formik.touched.currentPassword &&
              formik.errors.currentPassword ? (
                <div className="text-red-500 text-xs pl-3">
                  {formik.errors.currentPassword}
                </div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter your new password"
                  type={showNewPassword ? "text" : "password"} // Dynamic type
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.newPassword}
                  className={
                    formik.touched.newPassword && formik.errors.newPassword
                      ? "border-red-500 pr-10"
                      : "pr-10"
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showNewPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {formik.touched.newPassword && formik.errors.newPassword ? (
                <div className="text-red-500 text-xs pl-3">
                  {formik.errors.newPassword}
                </div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  type={showConfirmPassword ? "text" : "password"} // Dynamic type
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  className={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "border-red-500 pr-10"
                      : "pr-10"
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-500 text-xs pl-3">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              type="submit"
            >
              {false ? "Setting Password..." : "Set Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
