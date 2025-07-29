"use client"
import { FieldArray } from "formik"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface ContactDetailsStepProps {
  values: any
  errors: any
  touched: any
  setFieldValue: (field: string, value: any) => void
}

export default function ContactDetailsStep({ values, errors, touched, setFieldValue }: ContactDetailsStepProps) {
  return (
    <div className="space-y-6">
      <FieldArray name="contacts">
        {({ push, remove }) => (
          <div className="space-y-6">
            {values.contacts.map((contact: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                {values.contacts.length > 1 && (
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">Contact {index + 1}</h3>
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
                  {/* Contact Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Contact Type</Label>
                    <Select
                      value={contact.contactType}
                      onValueChange={(value) => setFieldValue(`contacts.${index}.contactType`, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="What kind of contact is this?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.contacts?.[index]?.contactType && touched.contacts?.[index]?.contactType && (
                      <p className="text-sm text-red-600">{errors.contacts[index].contactType}</p>
                    )}
                  </div>

                  {/* Contact Number */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Contact Number</Label>
                    <Input
                      type="tel"
                      placeholder="Enter contact number"
                      value={contact.contactNumber}
                      onChange={(e) => setFieldValue(`contacts.${index}.contactNumber`, e.target.value)}
                      className="w-full"
                    />
                    {errors.contacts?.[index]?.contactNumber && touched.contacts?.[index]?.contactNumber && (
                      <p className="text-sm text-red-600">{errors.contacts[index].contactNumber}</p>
                    )}
                  </div>

                  {/* Use as Primary */}
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={contact.useAsPrimary}
                      onCheckedChange={(checked) => setFieldValue(`contacts.${index}.useAsPrimary`, checked)}
                    />
                    <Label className="text-sm font-medium text-gray-700">Use as Primary</Label>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Another Button */}
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  push({
                    contactType: "",
                    contactNumber: "",
                    useAsPrimary: false,
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
