"use client"

import type React from "react"
import { useRef } from "react"
import { Field } from "formik"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface MembershipDetailsStepProps {
  values: any
  errors: any
  touched: any
  setFieldValue: (field: string, value: any) => void
}

export default function MembershipDetailsStep({ values, errors, touched, setFieldValue }: MembershipDetailsStepProps) {
  const profilePictureRef = useRef<HTMLInputElement>(null)
  const membershipDocRef = useRef<HTMLInputElement>(null)

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFieldValue("profilePicture", file)
    }
  }

  const handleMembershipDocUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFieldValue("membershipFeeDocument", file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Member ID */}
          <div className="space-y-2">
            <Label htmlFor="memberId" className="text-sm font-medium text-gray-700">
              Member ID
            </Label>
            <Field as={Input} id="memberId" name="memberId" className="w-full" readOnly />
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First Name
            </Label>
            <Field as={Input} id="firstName" name="firstName" placeholder="Enter first name" className="w-full" />
            {errors.firstName && touched.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name
            </Label>
            <Field as={Input} id="lastName" name="lastName" placeholder="Enter last name" className="w-full" />
            {errors.lastName && touched.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Gender</Label>
            <Select value={values.gender} onValueChange={(value) => setFieldValue("gender", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && touched.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !values.dateOfBirth && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {values.dateOfBirth ? format(values.dateOfBirth, "PPP") : "Select Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={values.dateOfBirth}
                  onSelect={(date) => setFieldValue("dateOfBirth", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.dateOfBirth && touched.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
          </div>

          {/* Institute Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Institute Name</Label>
            <Select value={values.instituteName} onValueChange={(value) => setFieldValue("instituteName", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose Institute" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="institute1">Institute 1</SelectItem>
                <SelectItem value="institute2">Institute 2</SelectItem>
                <SelectItem value="institute3">Institute 3</SelectItem>
              </SelectContent>
            </Select>
            {errors.instituteName && touched.instituteName && (
              <p className="text-sm text-red-600">{errors.instituteName}</p>
            )}
          </div>

          {/* Batch Year */}
          <div className="space-y-2">
            <Label htmlFor="batchYear" className="text-sm font-medium text-gray-700">
              Batch Year
            </Label>
            <Field as={Input} id="batchYear" name="batchYear" placeholder="Enter batch year" className="w-full" />
            {errors.batchYear && touched.batchYear && <p className="text-sm text-red-600">{errors.batchYear}</p>}
          </div>

          {/* Membership Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Membership Status</Label>
            <Select value={values.membershipStatus} onValueChange={(value) => setFieldValue("membershipStatus", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="What's Member Status?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            {errors.membershipStatus && touched.membershipStatus && (
              <p className="text-sm text-red-600">{errors.membershipStatus}</p>
            )}
          </div>

          {/* Marital Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Marital Status</Label>
            <Select value={values.maritalStatus} onValueChange={(value) => setFieldValue("maritalStatus", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="What's Marital Status?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
            {errors.maritalStatus && touched.maritalStatus && (
              <p className="text-sm text-red-600">{errors.maritalStatus}</p>
            )}
          </div>

          {/* Marriage Anniversary */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Marriage Anniversary</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !values.marriageAnniversary && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {values.marriageAnniversary ? format(values.marriageAnniversary, "PPP") : "Select Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={values.marriageAnniversary}
                  onSelect={(date) => setFieldValue("marriageAnniversary", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Profile Picture */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Profile Picture</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                ref={profilePictureRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
              {values.profilePicture ? (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{values.profilePicture.name}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setFieldValue("profilePicture", null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => profilePictureRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              )}
            </div>
          </div>

          {/* Due Limit */}
          <div className="space-y-2">
            <Label htmlFor="dueLimit" className="text-sm font-medium text-gray-700">
              Due Limit
            </Label>
            <Field as={Input} id="dueLimit" name="dueLimit" type="number" className="w-full" />
            {errors.dueLimit && touched.dueLimit && <p className="text-sm text-red-600">{errors.dueLimit}</p>}
          </div>

          {/* Membership Fee */}
          <div className="space-y-2">
            <Label htmlFor="membershipFee" className="text-sm font-medium text-gray-700">
              Membership Fee
            </Label>
            <Field
              as={Input}
              id="membershipFee"
              name="membershipFee"
              type="number"
              placeholder="Enter membership fee"
              className="w-full"
            />
            {errors.membershipFee && touched.membershipFee && (
              <p className="text-sm text-red-600">{errors.membershipFee}</p>
            )}
          </div>

          {/* Initial Payment Received */}
          <div className="space-y-2">
            <Label htmlFor="initialPayment" className="text-sm font-medium text-gray-700">
              Initial Payment Received
            </Label>
            <Field
              as={Input}
              id="initialPayment"
              name="initialPayment"
              type="number"
              placeholder="Enter initial payment"
              className="w-full"
            />
            {errors.initialPayment && touched.initialPayment && (
              <p className="text-sm text-red-600">{errors.initialPayment}</p>
            )}
          </div>

          {/* Remaining Fee */}
          <div className="space-y-2">
            <Label htmlFor="remainingFee" className="text-sm font-medium text-gray-700">
              Remaining Fee
            </Label>
            <Field
              as={Input}
              id="remainingFee"
              name="remainingFee"
              type="number"
              placeholder="Enter remaining fee"
              className="w-full"
            />
            {errors.remainingFee && touched.remainingFee && (
              <p className="text-sm text-red-600">{errors.remainingFee}</p>
            )}
          </div>

          {/* Subscription Fee */}
          <div className="space-y-2">
            <Label htmlFor="subscriptionFee" className="text-sm font-medium text-gray-700">
              Subscription Fee
            </Label>
            <Field
              as={Input}
              id="subscriptionFee"
              name="subscriptionFee"
              type="number"
              placeholder="Enter subscription fee"
              className="w-full"
            />
            {errors.subscriptionFee && touched.subscriptionFee && (
              <p className="text-sm text-red-600">{errors.subscriptionFee}</p>
            )}
          </div>

          {/* Membership Fee Payment Document */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Membership Fee Payment Document</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                ref={membershipDocRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleMembershipDocUpload}
                className="hidden"
              />
              {values.membershipFeeDocument ? (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{values.membershipFeeDocument.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFieldValue("membershipFeeDocument", null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => membershipDocRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              )}
            </div>
          </div>

          {/* Blood Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Blood Type</Label>
            <Select value={values.bloodType} onValueChange={(value) => setFieldValue("bloodType", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="What is his/her blood type?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
            {errors.bloodType && touched.bloodType && <p className="text-sm text-red-600">{errors.bloodType}</p>}
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Nationality</Label>
            <Select value={values.nationality} onValueChange={(value) => setFieldValue("nationality", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="What is his/her Nationality?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bangladeshi">Bangladeshi</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="pakistani">Pakistani</SelectItem>
                <SelectItem value="american">American</SelectItem>
                <SelectItem value="british">British</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.nationality && touched.nationality && <p className="text-sm text-red-600">{errors.nationality}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
