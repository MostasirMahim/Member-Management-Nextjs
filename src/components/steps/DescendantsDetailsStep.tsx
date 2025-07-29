"use client"

import type React from "react"
import { useRef } from "react"
import { FieldArray } from "formik"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, X, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface DescendantsDetailsStepProps {
  values: any
  errors: any
  touched: any
  setFieldValue: (field: string, value: any) => void
}

export default function DescendantsDetailsStep({
  values,
  errors,
  touched,
  setFieldValue,
}: DescendantsDetailsStepProps) {
  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([])

  const handleFileUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFieldValue(`descendants.${index}.descendantPicture`, file)
    }
  }

  return (
    <div className="space-y-6">
      <FieldArray name="descendants">
        {({ push, remove }) => (
          <div className="space-y-6">
            {values.descendants.map((descendant: any, index: number) => {
              return (
                <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                  {values.descendants.length > 1 && (
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900">Descendant {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-1">
                    {/* Descendant Name */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Descendant Name</Label>
                      <Input
                        placeholder="Enter Descendant Name"
                        value={descendant.descendantName}
                        onChange={(e) => setFieldValue(`descendants.${index}.descendantName`, e.target.value)}
                        className="w-full"
                      />
                      {errors.descendants?.[index]?.descendantName && touched.descendants?.[index]?.descendantName && (
                        <p className="text-sm text-red-600">{errors.descendants[index].descendantName}</p>
                      )}
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Contact Number</Label>
                      <Input
                        type="tel"
                        placeholder="Enter Descendant Contact"
                        value={descendant.descendantContact}
                        onChange={(e) => setFieldValue(`descendants.${index}.descendantContact`, e.target.value)}
                        className="w-full"
                      />
                      {errors.descendants?.[index]?.descendantContact &&
                        touched.descendants?.[index]?.descendantContact && (
                          <p className="text-sm text-red-600">{errors.descendants[index].descendantContact}</p>
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
                              !descendant.descendantDob && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {descendant.descendantDob ? format(descendant.descendantDob, "PPP") : "Select Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={descendant.descendantDob}
                            onSelect={(date) => setFieldValue(`descendants.${index}.descendantDob`, date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.descendants?.[index]?.descendantDob && touched.descendants?.[index]?.descendantDob && (
                        <p className="text-sm text-red-600">{errors.descendants[index].descendantDob}</p>
                      )}
                    </div>

                    {/* Descendant Picture */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Descendant Picture</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          ref={(el) => {
                            fileInputRefs.current[index] = el
                          }}
                          type="file"
                          accept="image/*"
                          onChange={(event) => handleFileUpload(index, event)}
                          className="hidden"
                        />
                        {descendant.descendantPicture ? (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{descendant.descendantPicture.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFieldValue(`descendants.${index}.descendantPicture`, null)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => fileInputRefs.current[index]?.click()}
                            className="w-full"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Relation Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Relation Type</Label>
                      <Select
                        value={descendant.descendantRelation}
                        onValueChange={(value) => setFieldValue(`descendants.${index}.descendantRelation`, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="What is the Relation with Member?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="son">Son</SelectItem>
                          <SelectItem value="daughter">Daughter</SelectItem>
                          <SelectItem value="grandson">Grandson</SelectItem>
                          <SelectItem value="granddaughter">Granddaughter</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.descendants?.[index]?.descendantRelation &&
                        touched.descendants?.[index]?.descendantRelation && (
                          <p className="text-sm text-red-600">{errors.descendants[index].descendantRelation}</p>
                        )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Add Another Button */}
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  push({
                    descendantName: "",
                    descendantContact: "",
                    descendantDob: null,
                    descendantPicture: null,
                    descendantRelation: "",
                  })
                }
                className="gap-2 bg-transparent"
              >
                <Plus className="w-4 h-4" />
                Add Another
              </Button>
            </div>
          </div>
        )}
      </FieldArray>
    </div>
  )
}
