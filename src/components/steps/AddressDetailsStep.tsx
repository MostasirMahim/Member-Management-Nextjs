"use client"
import { FieldArray } from "formik"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface AddressDetailsStepProps {
  values: any
  errors: any
  touched: any
  setFieldValue: (field: string, value: any) => void
}

export default function AddressDetailsStep({ values, errors, touched, setFieldValue }: AddressDetailsStepProps) {
  return (
    <div className="space-y-6">
      <FieldArray name="addresses">
        {({ push, remove }) => (
          <div className="space-y-6">
            {values.addresses.map((address: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                {values.addresses.length > 1 && (
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">Address {index + 1}</h3>
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
                  {/* Address Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Address Type</Label>
                    <Select
                      value={address.addressType}
                      onValueChange={(value) => setFieldValue(`addresses.${index}.addressType`, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="What kind of Address is this?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                        <SelectItem value="permanent">Permanent</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.addresses?.[index]?.addressType && touched.addresses?.[index]?.addressType && (
                      <p className="text-sm text-red-600">{errors.addresses[index].addressType}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Address</Label>
                    <Textarea
                      placeholder="Enter full address"
                      value={address.address}
                      onChange={(e) => setFieldValue(`addresses.${index}.address`, e.target.value)}
                      className="w-full min-h-[100px]"
                    />
                    {errors.addresses?.[index]?.address && touched.addresses?.[index]?.address && (
                      <p className="text-sm text-red-600">{errors.addresses[index].address}</p>
                    )}
                  </div>

                  {/* Use as Primary */}
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={address.addressAsPrimary}
                      onCheckedChange={(checked) => setFieldValue(`addresses.${index}.addressAsPrimary`, checked)}
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
                    addressType: "",
                    address: "",
                    addressAsPrimary: false,
                  })
                }
                className="gap-2 bg-transparent"
              >
                <Plus className="w-4 h-4" />
                Add Addresses
              </Button>
            </div>
          </div>
        )}
      </FieldArray>
    </div>
  )
}
