"use client"

import type React from "react"
import { useRef } from "react"
import { FieldArray } from "formik"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, X, Plus, Trash2 } from "lucide-react"

interface CertificateDetailsStepProps {
  values: any
  errors: any
  touched: any
  setFieldValue: (field: string, value: any) => void
}

export default function CertificateDetailsStep({
  values,
  errors,
  touched,
  setFieldValue,
}: CertificateDetailsStepProps) {
  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([])

  const handleFileUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFieldValue(`certificates.${index}.certificateFile`, file)
    }
  }

  const removeFile = (index: number) => {
    setFieldValue(`certificates.${index}.certificateFile`, null)
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = ""
    }
  }

  return (
    <div className="space-y-6">
      <FieldArray name="certificates">
        {({ push, remove }) => (
          <div className="space-y-6">
            {values.certificates.map((certificate: any, index: number) => {
              return (
                <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                  {values.certificates.length > 1 && (
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900">Certificate {index + 1}</h3>
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
                    {/* Certificate Title */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Certificate Title</Label>
                      <Input
                        placeholder="Enter Certificate Title"
                        value={certificate.certificateTitle}
                        onChange={(e) => setFieldValue(`certificates.${index}.certificateTitle`, e.target.value)}
                        className="w-full"
                      />
                      {errors.certificates?.[index]?.certificateTitle &&
                        touched.certificates?.[index]?.certificateTitle && (
                          <p className="text-sm text-red-600">{errors.certificates[index].certificateTitle}</p>
                        )}
                    </div>

                    {/* Upload Certificate */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Upload Certificate</Label>
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
                        {certificate.certificateFile ? (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{certificate.certificateFile.name}</span>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
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

                    {/* Certificate Number */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Certificate Number</Label>
                      <Input
                        placeholder="Enter Certificate Number"
                        value={certificate.certificateNumber}
                        onChange={(e) => setFieldValue(`certificates.${index}.certificateNumber`, e.target.value)}
                        className="w-full"
                      />
                      {errors.certificates?.[index]?.certificateNumber &&
                        touched.certificates?.[index]?.certificateNumber && (
                          <p className="text-sm text-red-600">{errors.certificates[index].certificateNumber}</p>
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
                    certificateTitle: "",
                    certificateFile: null,
                    certificateNumber: "",
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
