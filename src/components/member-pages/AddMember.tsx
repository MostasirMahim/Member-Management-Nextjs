"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import ContactDetailsStep from "../steps/ContactDetailsStep";
import CompanionDetailsStep from "../steps/CompanionDetailsStep";
import EmergencyContactStep from "../steps/EmergencyContactStep";
import CertificateDetailsStep from "../steps/CertificateDetailsStep";
import DocumentDetailsStep from "../steps/DocumentDetailsStep";
import EmailDetailsStep from "../steps/EmailDetailsStep";
import AddressDetailsStep from "../steps/AddressDetailsStep";
import SpouseDetailsStep from "../steps/SpouseDetailsStep";
import MembershipDetailsStep from "../steps/MembershipDetailsStep";
import DescendantsDetailsStep from "../steps/DescendantsDetailsStep";
import SpecialDaysStep from "../steps/SpecialDaysStep";
import { useAddMemberStore } from "@/store/store";
import JobDetailsStep from "../steps/JobDetailsStep";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const stepTitles = [
  "Membership Details",
  "Member Contact Details",
  "Member Emails Details",
  "Member Address Details",
  "Member Spouse Details",
  "Member Descendants Details",
  "Companion Details",
  "Emergency Contact Details",
  "Member Documents Details",
  "Member Certificate Details",
  "Member Job Details",
  "Member Special Days",
];

export default function AddMember() {
  const {
    currentStep,
    completedSteps,
    totalSteps,
    memberID,
    setCurrentStep,
    setMemberID,
  } = useAddMemberStore();
  const router = useRouter();
  const path = usePathname();
  const params = useParams();
  const isUpdatePage = path?.startsWith("/member/update/");

  useEffect(() => {
    if (!memberID && isUpdatePage && params.id) {
      setMemberID(params.id as string);
    }
  }, [isUpdatePage, params.id, memberID]);

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const renderStep = () => {
    const stepComponents = [
      <MembershipDetailsStep key="membership" />,
      <ContactDetailsStep key="contact" />,
      <EmailDetailsStep key="email" />,
      <AddressDetailsStep key="address" />,
      <SpouseDetailsStep key="spouse" />,
      <DescendantsDetailsStep key="descendants" />,
      <CompanionDetailsStep key="companion" />,
      <EmergencyContactStep key="emergency" />,
      <DocumentDetailsStep key="document" />,
      <CertificateDetailsStep key="certificate" />,
      <JobDetailsStep key="job" />,
      <SpecialDaysStep key="special-days" />,
    ];
    return stepComponents[currentStep];
  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="text-foreground">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">
              {isUpdatePage ? (
                <p>
                  Update Member{" "}
                  <span className="font-secondary text-lg text-sky-500">
                    #{memberID}
                  </span>
                </p>
              ) : (
                <p>
                  Add New Member <span>{memberID}</span>
                </p>
              )}
            </h1>
            <Badge variant="secondary" className="text-sm">
              Step {currentStep + 1} of {totalSteps}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{stepTitles[currentStep]}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <div className="hidden lg:flex justify-between mt-4 overflow-x-auto">
            {stepTitles.map((title, index) => (
              <div
                key={index}
                className={`flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer transition-colors ${
                  index <= currentStep ? "text-primary" : "text-gray-400"
                }`}
                onClick={() => handleStepClick(index)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    completedSteps.includes(index)
                      ? "bg-green-500 text-white"
                      : index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                  }`}
                >
                  {completedSteps.includes(index) ? "✓" : index + 1}
                </div>
                <span className="text-xs text-center truncate w-full px-1">
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-primary">
              {stepTitles[currentStep]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">{renderStep()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
