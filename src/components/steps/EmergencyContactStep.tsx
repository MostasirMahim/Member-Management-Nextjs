"use client"
import { Field } from "formik"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface EmergencyContactStepProps {
  values: any
  errors: any
  touched: any
  setFieldValue: (field: string, value: any) => void
}

export default function EmergencyContactStep({ values, errors, touched, setFieldValue }: EmergencyContactStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-1">
        {/* Contact Name */}
        <div className="space-y-2">
          <Label htmlFor="emergencyContactName" className="text-sm font-medium text-gray-700">
            Contact Name
          </Label>
          <Field
            as={Input}
            id="emergencyContactName"
            name="emergencyContactName"
            placeholder="Enter Emergency Contact Name"
            className="w-full"
          />
          {errors.emergencyContactName && touched.emergencyContactName && (
            <p className="text-sm text-red-600">{errors.emergencyContactName}</p>
          )}
        </div>

        {/* Contact Number */}
        <div className="space-y-2">
          <Label htmlFor="emergencyContactNumber" className="text-sm font-medium text-gray-700">
            Contact Number
          </Label>
          <Field
            as={Input}
            id="emergencyContactNumber"
            name="emergencyContactNumber"
            type="tel"
            placeholder="Enter Emergency Contact"
            className="w-full"
          />
          {errors.emergencyContactNumber && touched.emergencyContactNumber && (
            <p className="text-sm text-red-600">{errors.emergencyContactNumber}</p>
          )}
        </div>

        {/* Relation With Member */}
        <div className="space-y-2">
          <Label htmlFor="emergencyRelation" className="text-sm font-medium text-gray-700">
            Relation With Member
          </Label>
          <Field
            as={Input}
            id="emergencyRelation"
            name="emergencyRelation"
            placeholder="Enter Relation With Member"
            className="w-full"
          />
          {errors.emergencyRelation && touched.emergencyRelation && (
            <p className="text-sm text-red-600">{errors.emergencyRelation}</p>
          )}
        </div>
      </div>
    </div>
  )
}
