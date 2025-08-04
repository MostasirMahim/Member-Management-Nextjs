"use client";
//@ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
import { useStepStore } from "@/store/store";

const stepTitles = [
  "Membership Details",
  "Member Contact Details",
  "Companion Details",
  "Emergency Contact Details",
  "Member Certificate Details",
  "Member Documents Details",
  "Member Emails Details",
  "Member Address Details",
  "Member Spouse Details",
  "Member Descendants Details",
  "Special Days",
];

export default function AddMember() {
  const {
    currentStep,
    completedSteps,
    totalSteps,
    setCurrentStep,
    nextStep,
    prevStep,
    markStepCompleted,
  } = useStepStore();

  const handleNext = () => {
    console.log(
      `Moving from step ${currentStep + 1} to step ${currentStep + 2}`
    );
    markStepCompleted(currentStep);
    nextStep();
  };

  const handleBack = () => {
    console.log(
      `Moving back from step ${currentStep + 1} to step ${currentStep}`
    );
    prevStep();
  };

  const handleSkip = () => {
    console.log(`Skipping step ${currentStep + 1}`);
    nextStep();
  };

  const handleSaveAndExit = () => {
    console.log("Saving and exiting at step:", currentStep + 1);
    // Handle save and exit logic
  };

  const handleStepClick = (stepIndex: number) => {
    console.log(`Jumping to step ${stepIndex + 1}`);
    setCurrentStep(stepIndex);
  };

  const renderStep = () => {
    const stepComponents = [
      <MembershipDetailsStep key="membership" />,
      <ContactDetailsStep
        key="contact"
        values={null}
        errors={null}
        touched={null}
        setFieldValue={() => {}}
      />,
      <CompanionDetailsStep
        key="companion"
        values={null}
        errors={null}
        touched={null}
        setFieldValue={() => {}}
      />,
      <EmergencyContactStep
        key="emergency"
        values={null}
        errors={null}
        touched={null}
        setFieldValue={() => {}}
      />,
      <CertificateDetailsStep
        key="certificate"
        values={null}
        errors={null}
        touched={null}
        setFieldValue={() => {}}
      />,
      <DocumentDetailsStep
        key="document"
        values={null}
        errors={null}
        touched={null}
        setFieldValue={() => {}}
      />,
      <EmailDetailsStep
        key="email"
        values={null}
        errors={null}
        touched={null}
        setFieldValue={() => {}}
      />,
      <AddressDetailsStep
        key="address"
        values={null}
        errors={null}
        touched={null}
        setFieldValue={() => {}}
      />,
      <SpouseDetailsStep
        key="spouse"
        values={null}
        errors={null}
        touched={null}
        setFieldValue={() => {}}
      />,
      <DescendantsDetailsStep
        key="descendants"
        values={null}
        errors={null}
        touched={null}
        setFieldValue={() => {}}
      />,
      <SpecialDaysStep
        key="special-days"
        values={null}
        errors={null}
        touched={null}
        setFieldValue={() => {}}
      />,
    ];
    return stepComponents[currentStep];
  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="text-foreground">
      <div className="mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Add New Member</h1>
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

          {/* Step indicators for larger screens */}
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

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-primary">
              {stepTitles[currentStep]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {renderStep()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
