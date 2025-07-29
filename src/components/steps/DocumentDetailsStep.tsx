"use client"

import type React from "react"
import { useRef } from "react"
import { FieldArray } from "formik"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Plus, Trash2 } from "lucide-react"

interface DocumentDetailsStepProps {
  values: any
  errors: any
  touched: any
  setFieldValue: (field: string, value: any) => void
}

export default function DocumentDetailsStep({ values, errors, touched, setFieldValue }: DocumentDetailsStepProps) {
  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([])

  const handleFileUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFieldValue(`documents.${index}.documentFile`, file)
    }
  }

  return (
    <div className="space-y-6">
      <FieldArray name="documents">
        {({ push, remove }) => (
          <div className="space-y-6">
            {values.documents.map((document: any, index: number) => {
              return (
                <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                  {values.documents.length > 1 && (
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900">Document {index + 1}</h3>
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
                    {/* Document Number */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Document Number</Label>
                      <Input
                        placeholder="Enter Document Number"
                        value={document.documentNumber}
                        onChange={(e) => setFieldValue(`documents.${index}.documentNumber`, e.target.value)}
                        className="w-full"
                      />
                      {errors.documents?.[index]?.documentNumber && touched.documents?.[index]?.documentNumber && (
                        <p className="text-sm text-red-600">{errors.documents[index].documentNumber}</p>
                      )}
                    </div>

                    {/* Upload Document */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Upload Document</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          ref={(el) => {
                            fileInputRefs.current[index] = el
                          }}
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(event) => handleFileUpload(index, event)}
                          className="hidden"
                        />
                        {document.documentFile ? (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{document.documentFile.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFieldValue(`documents.${index}.documentFile`, null)}
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

                    {/* Document Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Select Document Type</Label>
                      <Select
                        value={document.documentType}
                        onValueChange={(value) => setFieldValue(`documents.${index}.documentType`, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="What kind of document is this?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="nid">National ID</SelectItem>
                          <SelectItem value="driving-license">Driving License</SelectItem>
                          <SelectItem value="birth-certificate">Birth Certificate</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.documents?.[index]?.documentType && touched.documents?.[index]?.documentType && (
                        <p className="text-sm text-red-600">{errors.documents[index].documentType}</p>
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
                    documentNumber: "",
                    documentFile: null,
                    documentType: "",
                  })
                }
                className="gap-2 bg-transparent"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another
              </Button>
            </div>
          </div>
        )}
      </FieldArray>
    </div>
  )
}
