"use client"
import { FieldArray } from "formik"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface EmailDetailsStepProps {
  values: any
  errors: any
  touched: any
  setFieldValue: (field: string, value: any) => void
}

export default function EmailDetailsStep({ values, errors, touched, setFieldValue }: EmailDetailsStepProps) {
  return (
    <div className="space-y-6">
      <FieldArray name="emails">
        {({ push, remove }) => (
          <div className="space-y-6">
            {values.emails.map((email: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                {values.emails.length > 1 && (
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">Email {index + 1}</h3>
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
                  {/* Email Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Email Type</Label>
                    <Select
                      value={email.emailType}
                      onValueChange={(value) => setFieldValue(`emails.${index}.emailType`, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="What kind of Email is this?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.emails?.[index]?.emailType && touched.emails?.[index]?.emailType && (
                      <p className="text-sm text-red-600">{errors.emails[index].emailType}</p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={email.emailAddress}
                      onChange={(e) => setFieldValue(`emails.${index}.emailAddress`, e.target.value)}
                      className="w-full"
                    />
                    {errors.emails?.[index]?.emailAddress && touched.emails?.[index]?.emailAddress && (
                      <p className="text-sm text-red-600">{errors.emails[index].emailAddress}</p>
                    )}
                  </div>

                  {/* Use as Primary */}
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={email.emailAsPrimary}
                      onCheckedChange={(checked) => setFieldValue(`emails.${index}.emailAsPrimary`, checked)}
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
                    emailType: "",
                    emailAddress: "",
                    emailAsPrimary: false,
                  })
                }
                className="gap-2 bg-transparent"
              >
                <Plus className="w-4 h-4" />
                Add Emails
              </Button>
            </div>
          </div>
        )}
      </FieldArray>
    </div>
  )
}
