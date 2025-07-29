"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "@/hooks/data/useAuthUser";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingDots } from "@/components/ui/loading";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axiosInstance";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

type LoginFormValues = {
  username: string;
  password: string;
  remember_me: boolean;
};

export default function page() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: user, isLoading } = useAuthUser();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading]);

  const { mutate: loginFunc, isPending } = useMutation({
    mutationFn: async (formData: LoginFormValues) => {
      const res = await axiosInstance.post("/api/account/v1/login/", formData);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.code === 200 && data.status === "success") {
        toast({
          title: data.details || "Login Successful",
          description: data.message,
          variant: "default",
        });
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        router.replace("/");
      }
    },
    onError: (error: any) => {
      console.log("Error in Login", error?.response);
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
      username: "",
      password: "",
      remember_me: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      loginFunc(values);
    },
  });

  if (isLoading) return <LoadingDots />;
  if (user) return null;
  return (
    <div className="flex min-h-screen bg-[#edf3fc] items-center justify-center  px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm rounded-lg shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/assets/logo.png"
              alt="Modernize Logo"
              width={48}
              height={48}
              className="h-16 w-16"
            />
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold ">Gagorian Club</h1>
              <p className="text-sm ">Your Social Campaigns</p>
            </div>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="Enter your password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-xs pl-3">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember_me"
                  name="remember_me"
                  checked={formik.values.remember_me}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue("remember_me", checked)
                  }
                />
                <Label htmlFor="remember_me" className="font-normal">
                  Remember this Device
                </Label>
              </div>
              <Link
                className="text-primary hover:underline"
                href="/forget-password/email"
              >
                Forgot Password ?
              </Link>
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
