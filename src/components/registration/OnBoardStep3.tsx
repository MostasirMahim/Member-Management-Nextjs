"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  PartyPopper,
  UserCog,
  UserPlus,
} from "lucide-react";
import { useRegUserStore } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

interface userInfoType {
  email: string;
  username: string;
  name: string;
  password: string;
}
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  fullname: Yup.string().required("Full name is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm New Password is required"),
});
export default function OnboardingStep3() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { email, isOtpPass } = useRegUserStore();
  const router = useRouter();
  const [registeredUsername, setRegisteredUsername] = useState("");

  useEffect(() => {
    if (!isOtpPass) {
      router.replace("/registration/otp");
    }
  }, [isOtpPass]);
  const { mutate: addNewMember, isPending } = useMutation({
    mutationFn: async (userInfo: userInfoType) => {
      const res = await axiosInstance.post(
        "/api/account/v1/authorization/admin_user_register/",
        userInfo
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        toast.success(data.message || "Registration successful.");
        formik.resetForm();
        setIsSuccess(true);
        setRegisteredUsername(data.username);
      }
    },
    onError: (error: any) => {
      console.error("Error In Regestaration :", error);
      const { message, errors } = error?.response.data;
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          formik.setFieldError(
            field,
            Array.isArray(messages) ? messages[0] : messages
          );
        });
      } else {
        toast.error(message || "An error occurred during registration");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      fullname: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const userInfo: userInfoType = {
        email,
        username: values.username,
        name: values.fullname,
        password: values.newPassword,
      };
      addNewMember(userInfo);
    },
  });

  const handleBack = () => {
    formik.resetForm();
    router.push("/registration/otp");
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen bg-[#edf3fc] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-sm min-h-[400px] rounded-lg shadow-lg flex justify-center items-center">
          <CardContent className="p-8 space-y-6 text-center  w-full">
            <div className="space-y-3 text-center w-full ">
              <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-blue-100 border-2 border-blue-200">
                <PartyPopper className="w-12 h-12 text-blue-600" />
              </div>

              <h1 className="text-2xl font-bold">
                Employee{" "}
                <span className="text-blue-600">{registeredUsername}</span> has
                been added
              </h1>
              <p className="text-gray-700 text-sm">
                An employee with given username has been successfully added
              </p>
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push("/registration/email")}
            >
              <UserPlus /> Add more
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center ">
      <Card className="w-full max-w-xl rounded-lg shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 border-2 border-blue-200">
              <UserCog className="w-12 h-12 text-blue-600" />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">Employee Details</h1>
              <p className="text-sm inline-block px-2 text-blue-600 font-medium border-2 p-1 rounded-md bg-blue-50 border-blue-700">
                {email}
              </p>
            </div>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <div className="space-y-2 w-full">
                <Label htmlFor="username">Employee Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Username"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  className={
                    formik.touched.username && formik.errors.username
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className="text-red-500 text-xs pl-3">
                    {formik.errors.username}
                  </div>
                ) : null}
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="fullname">Employee Name</Label>
                <Input
                  id="fullname"
                  name="fullname"
                  placeholder="Full Name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fullname}
                  className={
                    formik.touched.fullname && formik.errors.fullname
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.fullname && formik.errors.fullname ? (
                  <div className="text-red-500 text-xs pl-3">
                    {formik.errors.fullname}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <div className="space-y-2 w-full">
                <Label htmlFor="newPassword">
                  New Password
                  <span className="text-xs text-gray-500 font-primary font-thin">
                    {" "}
                    (At least 8 characters)
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    placeholder="Enter new password"
                    type={showNewPassword ? "text" : "password"} 
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
              <div className="space-y-2 w-full">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
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
            </div>
            <div className="flex gap-2">
              <Button
                className="w-full"
                type="button"
                variant={"outline"}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
