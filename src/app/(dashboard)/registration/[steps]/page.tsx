"use client";
import OnboardingStep1 from "@/components/registration/OnBoardStep1";
import OnboardingStep2 from "@/components/registration/OnBoardStep2";
import OnboardingStep3 from "@/components/registration/OnBoardStep3";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface OnboardingPageProps {
  params: {
    steps: string;
  };
}
const validSteps = ["email", "otp", "add"];
function OnboardingPage({ params }: OnboardingPageProps) {
  const { steps } = params;
  const router = useRouter();

  useEffect(() => {
    if (!validSteps.includes(steps)) {
      router.replace("/registration/email");
    }
  }, [steps, router]);
  return (
    <div>
      {steps === "email" && <OnboardingStep1 />}
      {steps === "otp" && <OnboardingStep2 />}
      {steps === "add" && <OnboardingStep3 />}
    </div>
  );
}

export default OnboardingPage;
