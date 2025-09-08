"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useState,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { useRegUserStore } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";


const validationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{4}$/, "OTP must be 4 digits")
    .required("OTP is required"),
});

export default function OnboardingStep2() {
  const { email, setOtpPass: SET_OTP_Pass } = useRegUserStore();
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    if (!email) {
      router.replace("/registration/email");
    }
  }, [email]);

  const { mutate: verifyRegOtp, isPending } = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: number }) => {
      const res = await axiosInstance.post(
        "/api/account/v1/authorization/admin_user_verify_otp/",
        { email, otp }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        SET_OTP_Pass(true);
        toast.success(data.message || "OTP verified successfully.");
        router.push("/registration/add");
      }
    },
    onError: (error: any) => {
      console.error("Error OTP Verification:", error);
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
      otp: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const otpValue = values.otp.replace(/\D/g, "");
      if (otpValue.length === 4) {
        verifyRegOtp({ email, otp: parseInt(otpValue, 10) });
      } else {
        alert("Please enter a valid 4-digit OTP.");
      }
    },
  });

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      formik.setFieldValue("otp", newOtp.join(""));
      if (value && index < 4) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleBack = () => {
    formik.resetForm();
    router.push("/registration/email");
  };

  return (
    <div className="flex items-center justify-center sm:px-6 lg:px-8">
      <Card className="w-full max-w-md min-h-[400px]  rounded-lg shadow-lg text-center">
        <CardContent className="p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 border-2 border-blue-200">
              <MailCheck className="w-12 h-12 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-800">
                Please enter the OTP sent to
              </h2>
              <p className="text-sm inline-block px-2 text-blue-600 font-medium border-2 p-1 rounded-md bg-blue-50 border-blue-700">
                {email}
              </p>
            </div>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                />
              ))}
            </div>
            {formik.touched.otp && formik.errors.otp ? (
              <div className="text-red-500 text-xs mt-2">
                {formik.errors.otp}
              </div>
            ) : null}
            <div className="text-sm text-gray-500">
              {"Didn't get the code? "}
              <Link className="text-blue-600 hover:underline" href="#">
                Resend
              </Link>
            </div>
            <div className="flex gap-2">
              <Button
                variant={"outline"}
                className="w-full"
                type="button"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Verifying..." : "Next"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
