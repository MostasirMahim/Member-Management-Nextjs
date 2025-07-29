"use client"

import { FieldArray } from "formik"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface SpecialDaysStepProps {
  values: any
  errors: any
  touched: any
  setFieldValue: (field: string, value: any) => void
}

export default function SpecialDaysStep({ values, errors, touched, setFieldValue }: SpecialDaysStepProps) {
  return (
    <div className="space-y-6">
      <FieldArray name="specialDays">
        {({ push, remove }) => (
          <div className="space-y-6">
            {values.specialDays.map((specialDay: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                {values.specialDays.length > 1 && (
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">Special Day {index + 1}</h3>
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
                  {/* Special Day Title */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Special Day Title</Label>
                    <Input
                      placeholder="Special Day Name"
                      value={specialDay.specialDayTitle}
                      onChange={(e) => setFieldValue(`specialDays.${index}.specialDayTitle`, e.target.value)}
                      className="w-full"
                    />
                    {errors.specialDays?.[index]?.specialDayTitle && touched.specialDays?.[index]?.specialDayTitle && (
                      <p className="text-sm text-red-600">{errors.specialDays[index].specialDayTitle}</p>
                    )}
                  </div>

                  {/* Select Special Day */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Select Special Day</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !specialDay.specialDayDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {specialDay.specialDayDate ? format(specialDay.specialDayDate, "PPP") : "Choose date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={specialDay.specialDayDate}
                          onSelect={(date) => setFieldValue(`specialDays.${index}.specialDayDate`, date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.specialDays?.[index]?.specialDayDate && touched.specialDays?.[index]?.specialDayDate && (
                      <p className="text-sm text-red-600">{errors.specialDays[index].specialDayDate}</p>
                    )}
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
                    specialDayTitle: "",
                    specialDayDate: null,
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
