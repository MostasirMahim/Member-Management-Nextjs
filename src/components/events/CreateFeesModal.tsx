"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus } from "lucide-react";
import useGetAllChoice from "@/hooks/data/useGetAllChoice";
import useGetAllEvents from "@/hooks/data/useGetAllEvents";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

interface CreateFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object({
  fee: Yup.number()
    .required("Fee amount is required")
    .positive("Fee must be a positive number")
    .min(0.01, "Fee must be at least $0.01"),
  event: Yup.number()
    .required("Event selection is required")
    .positive("Please select a valid event"),
  membership_type: Yup.string().required("Membership type is required"),
});

export function CreateFeeModal({ isOpen, onClose }: CreateFeeModalProps) {
  const { data: AllEvents, isLoading } = useGetAllEvents();
  const { data: choiceSections, isLoading: choiceLoading } = useGetAllChoice();
  const { membership_type } = choiceSections ?? {};

  const queryClient = useQueryClient();
  const { mutate: createFee, isPending } = useMutation({
    mutationFn: async (Data: any) => {
      const res = await axiosInstance.post("/api/event/v1/events/fees/", Data);
      return res.data;
    },
    onSuccess: async (data) => {
      if (data?.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["getAllFees"] });
        formik.resetForm();
        onClose();
        toast.success("Fee Created Successfully");
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          formik.setFieldError(
            field,
            Array.isArray(messages) ? messages[0] : messages
          );
        });
        toast.error(detail || "An error occurred during Added");
      } else {
        toast.error(message || "An error occurred during Added");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      fee: "",
      event: "",
      membership_type: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const data = {
        fee: Number.parseFloat(values.fee),
        event: Number.parseInt(values.event),
        membership_type: values.membership_type,
      };

      createFee(data);
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Fee
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Fee Amount */}
          <div className="space-y-2">
            <Label htmlFor="fee">Fee Amount ($)</Label>
            <Input
              id="fee"
              name="fee"
              type="number"
              step="0.01"
              placeholder="Enter fee amount"
              value={formik.values.fee}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.fee && formik.errors.fee ? "border-red-500" : ""
              }
            />
            {formik.touched.fee && formik.errors.fee && (
              <p className="text-sm text-red-500">{formik.errors.fee}</p>
            )}
          </div>

          {/* Event Selection */}
          <div className="space-y-2">
            <Label htmlFor="event">Event</Label>
            {/* Event Selection */}
            <Select
              value={formik.values.event}
              onValueChange={(value) => formik.setFieldValue("event", value)}
            >
              <SelectTrigger
                className={
                  formik.touched.event && formik.errors.event
                    ? "border-red-500"
                    : ""
                }
              >
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {AllEvents?.data?.map((event: any) => (
                  <SelectItem key={event.id} value={event.id.toString()}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.event && formik.errors.event && (
              <p className="text-sm text-red-500">{formik.errors.event}</p>
            )}
          </div>

          {/* Membership Type */}
          <div className="space-y-2">
            <Label htmlFor="membership_type">Membership Type</Label>
            <Select
              value={formik.values.membership_type}
              onValueChange={(value) =>
                formik.setFieldValue("membership_type", value)
              }
            >
              <SelectTrigger
                className={
                  formik.touched.membership_type &&
                  formik.errors.membership_type
                    ? "border-red-500"
                    : ""
                }
              >
                <SelectValue placeholder="Select a membership type" />
              </SelectTrigger>
              <SelectContent>
                {membership_type?.map((type: any) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.membership_type &&
              formik.errors.membership_type && (
                <p className="text-sm text-red-500">
                  {formik.errors.membership_type}
                </p>
              )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Fee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
