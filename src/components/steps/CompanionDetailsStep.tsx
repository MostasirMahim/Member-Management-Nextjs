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

interface CompanionDetailsStepProps {
  values: any
  errors: any
  touched: any
  setFieldValue: (field: string, value: any) => void
}

export default function CompanionDetailsStep({ values, errors, touched, setFieldValue }: CompanionDetailsStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFieldValue("descendantPicture", file)
    }
  }

  const removeFile = () => {
    setFieldValue("descendantPicture", null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-1">
        {/* Companion Name */}
        <div className="space-y-2">
          <Label htmlFor="companionName" className="text-sm font-medium text-gray-700">
            Companion Name
          </Label>
          <Field
            as={Input}
            id="companionName"
            name="companionName"
            placeholder="Enter Companion Name"
            className="w-full"
          />
          {errors.companionName && touched.companionName && (
            <p className="text-sm text-red-600">{errors.companionName}</p>
          )}
        </div>

        {/* Contact Number */}
        <div className="space-y-2">
          <Label htmlFor="companionContact" className="text-sm font-medium text-gray-700">
            Contact Number
          </Label>
          <Field
            as={Input}
            id="companionContact"
            name="companionContact"
            type="tel"
            placeholder="Enter Companion Contact"
            className="w-full"
          />
          {errors.companionContact && touched.companionContact && (
            <p className="text-sm text-red-600">{errors.companionContact}</p>
          )}
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
                  !values.companionDob && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {values.companionDob ? format(values.companionDob, "PPP") : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={values.companionDob}
                onSelect={(date) => setFieldValue("companionDob", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.companionDob && touched.companionDob && <p className="text-sm text-red-600">{errors.companionDob}</p>}
        </div>

        {/* Descendant Picture */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Descendant Picture</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            {values.descendantPicture ? (
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{values.descendantPicture.name}</span>
                <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button type="button" variant="ghost" onClick={() => fileInputRef.current?.click()} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            )}
          </div>
        </div>

        {/* Companion Card */}
        <div className="space-y-2">
          <Label htmlFor="companionCard" className="text-sm font-medium text-gray-700">
            Companion Card
          </Label>
          <Field
            as={Input}
            id="companionCard"
            name="companionCard"
            placeholder="Enter Companion Card Number"
            className="w-full"
          />
          {errors.companionCard && touched.companionCard && (
            <p className="text-sm text-red-600">{errors.companionCard}</p>
          )}
        </div>

        {/* Relation Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Relation Type</Label>
          <Select value={values.relationType} onValueChange={(value) => setFieldValue("relationType", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Companion Relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spouse">Spouse</SelectItem>
              <SelectItem value="child">Child</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="sibling">Sibling</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.relationType && touched.relationType && <p className="text-sm text-red-600">{errors.relationType}</p>}
        </div>
      </div>
    </div>
  )
}
