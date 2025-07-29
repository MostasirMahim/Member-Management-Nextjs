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

interface SpouseDetailsStepProps {
  values: any
  errors: any
  touched: any
  setFieldValue: (field: string, value: any) => void
}

export default function SpouseDetailsStep({ values, errors, touched, setFieldValue }: SpouseDetailsStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFieldValue("spousePicture", file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-1">
        <div className="space-y-2">
          <Label htmlFor="spouseName" className="text-sm font-medium text-gray-700">
            Spouse Name
          </Label>
          <Field as={Input} id="spouseName" name="spouseName" placeholder="Enter Spouse Name" className="w-full" />
          {errors.spouseName && touched.spouseName && <p className="text-sm text-red-600">{errors.spouseName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="spouseContact" className="text-sm font-medium text-gray-700">
            Contact Number
          </Label>
          <Field
            as={Input}
            id="spouseContact"
            name="spouseContact"
            type="tel"
            placeholder="Enter Spouse Contact"
            className="w-full"
          />
          {errors.spouseContact && touched.spouseContact && (
            <p className="text-sm text-red-600">{errors.spouseContact}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !values.spouseDob && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {values.spouseDob ? format(values.spouseDob, "PPP") : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={values.spouseDob}
                onSelect={(date) => setFieldValue("spouseDob", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.spouseDob && touched.spouseDob && <p className="text-sm text-red-600">{errors.spouseDob}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Spouse Picture</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            {values.spousePicture ? (
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{values.spousePicture.name}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => setFieldValue("spousePicture", null)}>
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

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Status</Label>
          <Select value={values.spouseStatus} onValueChange={(value) => setFieldValue("spouseStatus", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="What is the spouse status?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alive">Alive</SelectItem>
              <SelectItem value="deceased">Deceased</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="separated">Separated</SelectItem>
            </SelectContent>
          </Select>
          {errors.spouseStatus && touched.spouseStatus && <p className="text-sm text-red-600">{errors.spouseStatus}</p>}
        </div>
      </div>
    </div>
  )
}
