"use client"

import { useState } from "react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"


import ContactDetailsStep from "../steps/ContactDetailsStep"
import CompanionDetailsStep from "../steps/CompanionDetailsStep"
import EmergencyContactStep from "../steps/EmergencyContactStep"
import CertificateDetailsStep from "../steps/CertificateDetailsStep"
import DocumentDetailsStep from "../steps/DocumentDetailsStep"
import EmailDetailsStep from "../steps/EmailDetailsStep"
import AddressDetailsStep from "../steps/AddressDetailsStep"
import SpouseDetailsStep from "../steps/SpouseDetailsStep"
import MembershipDetailsStep from "../steps/MembershipDetailsStep"
import DescendantsDetailsStep from "../steps/DescendantsDetailsStep"
import SpecialDaysStep from "../steps/SpecialDaysStep"



// Validation schemas for each step
const validationSchemas = [
  // Step 1: Contact Details
  Yup.object({
    contacts: Yup.array()
      .of(
        Yup.object({
          contactType: Yup.string().required("Contact type is required"),
          contactNumber: Yup.string().required("Contact number is required"),
          useAsPrimary: Yup.boolean(),
        }),
      )
      .min(1, "At least one contact is required"),
  }),
  // Step 2: Companion Details
  Yup.object({
    companionName: Yup.string().required("Companion name is required"),
    companionContact: Yup.string().required("Companion contact is required"),
    companionDob: Yup.date().required("Date of birth is required"),
    companionCard: Yup.string().required("Companion card number is required"),
    relationType: Yup.string().required("Relation type is required"),
  }),
  // Step 3: Emergency Contact
  Yup.object({
    emergencyContactName: Yup.string().required("Emergency contact name is required"),
    emergencyContactNumber: Yup.string().required("Emergency contact number is required"),
    emergencyRelation: Yup.string().required("Relation with member is required"),
  }),
  // Step 4: Certificate Details
  Yup.object({
    certificates: Yup.array()
      .of(
        Yup.object({
          certificateTitle: Yup.string().required("Certificate title is required"),
          certificateNumber: Yup.string().required("Certificate number is required"),
          certificateFile: Yup.mixed(),
        }),
      )
      .min(1, "At least one certificate is required"),
  }),
  // Step 5: Document Details
  Yup.object({
    documents: Yup.array()
      .of(
        Yup.object({
          documentNumber: Yup.string().required("Document number is required"),
          documentType: Yup.string().required("Document type is required"),
          documentFile: Yup.mixed(),
        }),
      )
      .min(1, "At least one document is required"),
  }),
  // Step 6: Email Details
  Yup.object({
    emails: Yup.array()
      .of(
        Yup.object({
          emailType: Yup.string().required("Email type is required"),
          emailAddress: Yup.string().email("Invalid email").required("Email address is required"),
          emailAsPrimary: Yup.boolean(),
        }),
      )
      .min(1, "At least one email is required"),
  }),
  // Step 7: Address Details
  Yup.object({
    addresses: Yup.array()
      .of(
        Yup.object({
          addressType: Yup.string().required("Address type is required"),
          address: Yup.string().required("Address is required"),
          addressAsPrimary: Yup.boolean(),
        }),
      )
      .min(1, "At least one address is required"),
  }),
  // Step 8: Spouse Details
  Yup.object({
    spouseName: Yup.string().required("Spouse name is required"),
    spouseContact: Yup.string().required("Spouse contact is required"),
    spouseDob: Yup.date().required("Spouse date of birth is required"),
    spouseStatus: Yup.string().required("Spouse status is required"),
  }),
  // Step 9: Membership Details
  Yup.object({
    memberId: Yup.string().required("Member ID is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    gender: Yup.string().required("Gender is required"),
    dateOfBirth: Yup.date().required("Date of birth is required"),
    instituteName: Yup.string().required("Institute name is required"),
    batchYear: Yup.string().required("Batch year is required"),
    membershipStatus: Yup.string().required("Membership status is required"),
    maritalStatus: Yup.string().required("Marital status is required"),
    bloodType: Yup.string().required("Blood type is required"),
    nationality: Yup.string().required("Nationality is required"),
    dueLimit: Yup.number().required("Due limit is required"),
    membershipFee: Yup.number().required("Membership fee is required"),
    initialPayment: Yup.number().required("Initial payment is required"),
    remainingFee: Yup.number().required("Remaining fee is required"),
    subscriptionFee: Yup.number().required("Subscription fee is required"),
  }),
  // Step 10: Descendants Details
  Yup.object({
    descendants: Yup.array()
      .of(
        Yup.object({
          descendantName: Yup.string().required("Descendant name is required"),
          descendantContact: Yup.string().required("Descendant contact is required"),
          descendantDob: Yup.date().required("Descendant date of birth is required"),
          descendantRelation: Yup.string().required("Relation type is required"),
          descendantPicture: Yup.mixed(),
        }),
      )
      .min(1, "At least one descendant is required"),
  }),
  // Step 11: Special Days
  Yup.object({
    specialDays: Yup.array()
      .of(
        Yup.object({
          specialDayTitle: Yup.string().required("Special day title is required"),
          specialDayDate: Yup.date().required("Special day date is required"),
        }),
      )
      .min(1, "At least one special day is required"),
  }),
]

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
]

const initialValues = {
  // Step 1: Contact Details (Array)
  contacts: [
    {
      contactType: "",
      contactNumber: "",
      useAsPrimary: false,
    },
  ],

  // Step 2: Companion Details
  companionName: "",
  companionContact: "",
  companionDob: null,
  descendantPicture: null,
  companionCard: "",
  relationType: "",

  // Step 3: Emergency Contact
  emergencyContactName: "",
  emergencyContactNumber: "",
  emergencyRelation: "",

  // Step 4: Certificate Details (Array)
  certificates: [
    {
      certificateTitle: "",
      certificateFile: null,
      certificateNumber: "",
    },
  ],

  // Step 5: Document Details (Array)
  documents: [
    {
      documentNumber: "",
      documentFile: null,
      documentType: "",
    },
  ],

  // Step 6: Email Details (Array)
  emails: [
    {
      emailType: "",
      emailAddress: "",
      emailAsPrimary: false,
    },
  ],

  // Step 7: Address Details (Array)
  addresses: [
    {
      addressType: "",
      address: "",
      addressAsPrimary: false,
    },
  ],

  // Step 8: Spouse Details
  spouseName: "",
  spouseContact: "",
  spouseDob: null,
  spousePicture: null,
  spouseStatus: "",

  // Step 9: Membership Details
  memberId: "AM0001",
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: null,
  instituteName: "",
  batchYear: "",
  membershipStatus: "",
  maritalStatus: "",
  marriageAnniversary: null,
  profilePicture: null,
  dueLimit: 30000,
  membershipFee: "",
  initialPayment: "",
  remainingFee: "",
  subscriptionFee: "",
  membershipFeeDocument: null,
  bloodType: "",
  nationality: "",

  // Step 10: Descendants Details (Array)
  descendants: [
    {
      descendantName: "",
      descendantContact: "",
      descendantDob: null,
      descendantPicture: null,
      descendantRelation: "",
    },
  ],

  // Step 11: Special Days (Array)
  specialDays: [
    {
      specialDayTitle: "",
      specialDayDate: null,
    },
  ],
}

export default function AddMember() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const handleNext = (values: any, { setTouched, validateForm }: any) => {
    // validateForm().then((errors: any) => {
    //   if (Object.keys(errors).length === 0) {
    //     if (!completedSteps.includes(currentStep)) {
    //       setCompletedSteps([...completedSteps, currentStep])
    //     }
    //     setCurrentStep(currentStep + 1)
    //   } else {
    //     setTouched(Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    //   }
    // })
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    setCurrentStep(currentStep + 1)
  }

  const handleSaveAndExit = (values: any) => {
    console.log("Saving and exiting:", values)
    // Handle save and exit logic
  }

  const renderStep = (values: any, errors: any, touched: any, setFieldValue: any) => {
    const stepComponents = [
      <MembershipDetailsStep
        key="membership"
        values={values}
        errors={errors}
        touched={touched}
        setFieldValue={setFieldValue}
      />,
      <ContactDetailsStep
        key="contact"
        values={values}
        errors={errors}
        touched={touched}
        setFieldValue={setFieldValue}
      />,
      <CompanionDetailsStep
        key="companion"
        values={values}
        errors={errors}
        touched={touched}
        setFieldValue={setFieldValue}
      />,
      <EmergencyContactStep
        key="emergency"
        values={values}
        errors={errors}
        touched={touched}
        setFieldValue={setFieldValue}
      />,
      <CertificateDetailsStep
        key="certificate"
        values={values}
        errors={errors}
        touched={touched}
        setFieldValue={setFieldValue}
      />,
      <DocumentDetailsStep
        key="document"
        values={values}
        errors={errors}
        touched={touched}
        setFieldValue={setFieldValue}
      />,
      <EmailDetailsStep key="email" values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} />,
      <AddressDetailsStep
        key="address"
        values={values}
        errors={errors}
        touched={touched}
        setFieldValue={setFieldValue}
      />,
      <SpouseDetailsStep
        key="spouse"
        values={values}
        errors={errors}
        touched={touched}
        setFieldValue={setFieldValue}
      />,
      
      <DescendantsDetailsStep
        key="descendants"
        values={values}
        errors={errors}
        touched={touched}
        setFieldValue={setFieldValue}
      />,
      <SpecialDaysStep
        key="special-days"
        values={values}
        errors={errors}
        touched={touched}
        setFieldValue={setFieldValue}
      />,
    ]

    return stepComponents[currentStep]
  }

  const progressPercentage = ((currentStep + 1) / stepTitles.length) * 100

  return (
    <div className=" text-foreground ">
      <div className=" mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold ">Add New Member</h1>
            <Badge variant="secondary" className="text-sm">
              Step {currentStep + 1} of {stepTitles.length}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm ">
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
                className={`flex flex-col items-center space-y-1 min-w-0 flex-1 ${
                  index <= currentStep ? "text-primary" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    index < currentStep
                      ? "bg-primary text-primary-foreground"
                      : index === currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-primary">{stepTitles[currentStep]}</CardTitle>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchemas[currentStep]}
              onSubmit={(values :any) => {
                if (currentStep === stepTitles.length - 1) {
                  console.log("Final submission:", values)
                  // Handle final submission
                } else {
                  handleNext(values, { setTouched: () => {}, validateForm: () => Promise.resolve({}) })
                }
              }}
            >
              {(formik: {
                values: typeof initialValues,
                errors: any,
                touched: any,
                setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
                setTouched: (fields: any, shouldValidate?: boolean) => void,
                validateForm: () => Promise<any>
              }) => {
                const { values, errors, touched, setFieldValue, setTouched, validateForm } = formik;
                return (
                  <Form className="space-y-6">
                    {renderStep(values, errors, touched, setFieldValue)}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                    <div className="flex gap-3 flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="flex-1 sm:flex-none bg-transparent"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Save & Back
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSaveAndExit(values)}
                        className="flex-1 sm:flex-none"
                      >
                        Save & Exit
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleSkip}
                        disabled={currentStep === stepTitles.length - 1}
                        className="flex-1 sm:flex-none"
                      >
                        Skip
                      </Button>
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleNext(values, { setTouched, validateForm })}
                      disabled={currentStep === stepTitles.length - 1}
                      className="bg-black hover:bg-gray-800 text-white flex-1 sm:flex-none sm:min-w-[140px]"
                    >
                      {currentStep === stepTitles.length - 1 ? "Finish" : "Save & Next"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Form>
              );
            }}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
