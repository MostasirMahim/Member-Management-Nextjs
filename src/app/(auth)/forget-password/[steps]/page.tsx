"use client";
import EmailStep from "@/components/auth/EmailStep";
import SetNewPasswordForm from "@/components/auth/NewPass";
import OtpStep from "@/components/auth/OtpStep";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ResetPasswordPageProps {
  params: {
    steps: string;
  };
}
const validSteps = ["email", "otp", "reset"];
function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { steps } = params;
  const router = useRouter();

  useEffect(() => {
    if (!validSteps.includes(steps)) {
      router.replace("/forget-password/email");
    }
  }, [steps, router]);

  return (
    <div>
      {steps === "email" && <EmailStep />}
      {steps === "otp" && <OtpStep />}
      {steps === "reset" && <SetNewPasswordForm />}
    </div>
  );
}

export default ResetPasswordPage;
