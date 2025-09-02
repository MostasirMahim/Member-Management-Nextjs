"use client"

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { dummyVenues } from "@/lib/dummy"
import useGetAllVenues from "@/hooks/data/useGetAllVenues"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/lib/axiosInstance"
import { toast } from "react-toastify"

const eventSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  start_date: Yup.string().required("Start date is required"),
  end_date: Yup.string().required("End date is required"),
  status: Yup.string().required("Status is required"),
  registration_deadline: Yup.string().required("Registration deadline is required"),
  event_type: Yup.string().required("Event type is required"),
  reminder_time: Yup.string().required("Reminder time is required"),
  venue: Yup.number().required("Venue is required"),
  organizer: Yup.string().required("Organizer is required"),
})

export function CreateEventModal() {
  const {data:AllVenues, isLoading:VenuesLoading} = useGetAllVenues();
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient();
  const { mutate: createEvents, isPending } = useMutation({
    mutationFn: async (Data: any) => {
      const res = await axiosInstance.post(
        "/api/event/v1/events/",
        Data
      );
      return res.data;
    },
    onSuccess: async (data) => {
      if (data?.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["getAllEvents"] });
        formik.resetForm();
        setOpen(false);
        toast.success("Event Created Successfully");
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      if (errors) {
        const allErrors = Object.values(errors).flat().join("\n");
        toast.error(detail || "An error occurred during Added");
      } else {
        toast.error(message || "An error occurred during Added");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      status: "planned",
      registration_deadline: "",
      event_type: "",
      reminder_time: "",
      venue: "",
      organizer: "",
    },
    validationSchema: eventSchema,
    onSubmit: (values) => {
      createEvents(values);
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Tech Conference 2025"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-sm text-destructive">{formik.errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="An event for tech enthusiasts and professionals."
              rows={3}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-destructive">{formik.errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date & Time</Label>
              <Input
                id="start_date"
                name="start_date"
                type="datetime-local"
                value={formik.values.start_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.start_date && formik.errors.start_date && (
                <p className="text-sm text-destructive">{formik.errors.start_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date & Time</Label>
              <Input
                id="end_date"
                name="end_date"
                type="datetime-local"
                value={formik.values.end_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.end_date && formik.errors.end_date && (
                <p className="text-sm text-destructive">{formik.errors.end_date}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formik.values.status} onValueChange={(value) => formik.setFieldValue("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.status && formik.errors.status && (
                <p className="text-sm text-destructive">{formik.errors.status}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_type">Event Type</Label>
              <Input
                id="event_type"
                name="event_type"
                value={formik.values.event_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Conference"
              />
              {formik.touched.event_type && formik.errors.event_type && (
                <p className="text-sm text-destructive">{formik.errors.event_type}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registration_deadline">Registration Deadline</Label>
            <Input
              id="registration_deadline"
              name="registration_deadline"
              type="datetime-local"
              value={formik.values.registration_deadline}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.registration_deadline && formik.errors.registration_deadline && (
              <p className="text-sm text-destructive">{formik.errors.registration_deadline}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder_time">Reminder Time</Label>
            <Input
              id="reminder_time"
              name="reminder_time"
              type="datetime-local"
              value={formik.values.reminder_time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.reminder_time && formik.errors.reminder_time && (
              <p className="text-sm text-destructive">{formik.errors.reminder_time}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Select
              value={formik.values.venue}
              onValueChange={(value) => formik.setFieldValue("venue", Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select venue" />
              </SelectTrigger>
              <SelectContent>
                {AllVenues?.data?.map((venue:any) => (
                  <SelectItem key={venue.id} value={venue.id.toString()}>
                    {venue.street_address}, {venue.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.venue && formik.errors.venue && (
              <p className="text-sm text-destructive">{formik.errors.venue}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizer">Organizer ID</Label>
            <Input
              id="organizer"
              name="organizer"
              value={formik.values.organizer}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="GM0001-PU"
            />
            {formik.touched.organizer && formik.errors.organizer && (
              <p className="text-sm text-destructive">{formik.errors.organizer}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
