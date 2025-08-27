"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import useGetAllChoice from "@/hooks/data/useGetAllChoice";
import useGetMember from "@/hooks/data/useGetMember";
import { LoadingCard } from "../ui/loading";
import { useParams, useRouter } from "next/navigation";

const validationSchema = Yup.object({
  membership_type: Yup.string().required("Membership type is required"),
  institute_name: Yup.string().required("Institute name is required"),
});

export default function MemberIdTransfer() {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: choiceSections, isLoading } = useGetAllChoice();
  const { data, isLoading: isLoadingMember } = useGetMember(
    params?.id as string,
    {
      enabled: !!params?.id,
    }
  );
  const { member_info: memberData } = data ?? {};
  const { membership_type, institute_name } = choiceSections ?? {};

  const { mutate: generateID, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.post(
        `/api/member/v1/members/get_latest_id/`,
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        const member_ID = data?.data?.next_available;
        if (member_ID) {
          formik.setFieldValue("new_member_ID", member_ID);
          toast.success("Member ID generated successfully");
        }
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      if (errors) {
        if (errors && typeof errors === "object") {
          Object.entries(errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              formik.setFieldError(field, messages[0]);
            }
          });
          toast.error(detail || message || "Generate ID Failed");
        }
      } else {
        toast.error(detail || message || "Generate ID Failed");
      }
    },
  });

  const { mutate: updateMember, isPending: isUpdating } = useMutation({
    mutationFn: async (userData: any) => {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        if (value != null) {
          formData.append(key, value as any);
        }
      });
      const res = await axiosInstance.patch(
        `/api/member/v1/members/${params?.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: async(data) => {
      if (data?.status === "success") {
        await queryClient.refetchQueries({ queryKey: ["getAllMembers"], exact: false });
          toast.success(data.message || "ID Transfer Successfully.");
        router.push("/members/view");
        router.refresh();
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      function toastApiErrors(errors: Record<string, string[]>) {
        Object.keys(errors).forEach((key) => {
          const message = errors[key]?.[0];
          if (message) {
            toast.error(message);
          }
        });
      }
      if (errors) {
        toastApiErrors(errors);
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      current_member_ID: params?.id ?? "",
      new_member_ID: memberData?.member_ID ?? "",
      membership_type: memberData?.membership_type?.name ?? "",
      institute_name: memberData?.institute_name?.name ?? "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (formik.dirty && memberData) {
        const data = {
          id: memberData?.id,
          member_ID: values.new_member_ID,
          first_name: memberData?.first_name,
          last_name: memberData?.last_name,
          gender: memberData.gender?.name,
          date_of_birth: memberData?.date_of_birth,
          institute_name: isCustomMode
            ? memberData?.institute_name?.name
            : values.institute_name,
          batch_number: memberData?.batch_number,
          membership_status: memberData?.membership_status?.name,
          membership_type: isCustomMode
            ? memberData?.membership_type?.name
            : values.membership_type,
          marital_status: memberData?.marital_status?.name,
          anniversary_date: memberData?.anniversary_date,
          profile_photo: null as File | null,
          blood_group: memberData?.blood_group,
          nationality: memberData?.nationality,
        };
        updateMember(data);
      } 
    },
  });
  const handleFieldChangeAndGenerateID = (fieldName: string, value: string) => {
    formik.setFieldValue(fieldName, value);
    const otherFieldValue =
      fieldName === "membership_type"
        ? formik.values.institute_name
        : formik.values.membership_type;
    const currentFieldValue = value?.trim();
    const otherFieldTrimmed = otherFieldValue?.trim();

    if (
      currentFieldValue &&
      currentFieldValue !== "" &&
      otherFieldTrimmed &&
      otherFieldTrimmed !== ""
    ) {
      const data = {
        membership_type:
          fieldName === "membership_type"
            ? value
            : formik.values.membership_type,
        institute_name:
          fieldName === "institute_name" ? value : formik.values.institute_name,
      };
      generateID(data);
    }
  };

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg ">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium ">ID Management</h3>
        <div className="flex items-center space-x-2">
          <Label htmlFor="custom-mode" className="text-sm">
            Custom ID
          </Label>
          <Switch
            id="custom-mode"
            checked={isCustomMode}
            onCheckedChange={() => {
              setIsCustomMode(!isCustomMode),
                (formik.values.new_member_ID = params?.id as string);
            }}
          />
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 ">
            <Label className="text-sm font-medium ">Current Member ID</Label>
            <div className="flex gap-2">
              <Input
                value={formik.values.current_member_ID}
                onChange={(e) =>
                  formik.setFieldValue("current_member_ID", e.target.value)
                }
                placeholder="Member ID"
                disabled
                className="flex-1"
              />
            </div>
            {formik.touched.current_member_ID &&
              formik.errors.current_member_ID && (
                <p className="text-sm text-red-600">
                  {formik.errors.current_member_ID as string}
                </p>
              )}
          </div>
          <div className="space-y-2 ">
            <Label className="text-sm font-medium ">New Member ID</Label>
            <div className="flex gap-2">
              <Input
                value={formik.values.new_member_ID}
                onChange={(e) =>
                  formik.setFieldValue("new_member_ID", e.target.value)
                }
                placeholder="Member ID"
                disabled={!isCustomMode}
                className="flex-1"
              />
            </div>
            {formik.touched.new_member_ID && formik.errors.new_member_ID && (
              <p className="text-sm text-red-600">
                {formik.errors.new_member_ID as string}
              </p>
            )}
          </div>
          {!isCustomMode && (
            <div className="space-y-2">
              <Label className="text-sm font-medium ">Membership Type</Label>
              <Select
                value={formik.values.membership_type}
                onValueChange={(value) =>
                  handleFieldChangeAndGenerateID("membership_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Membership Type" />
                </SelectTrigger>
                <SelectContent>
                  {membership_type?.map((choice: any, index: number) => (
                    <SelectItem key={index} value={choice.name}>
                      {choice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.membership_type &&
                formik.errors.membership_type && (
                  <p className="text-sm text-red-600">
                    {formik.errors.membership_type as string}
                  </p>
                )}
            </div>
          )}

          {!isCustomMode && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Institute Name</Label>
              <Select
                value={formik.values.institute_name}
                onValueChange={(value) =>
                  handleFieldChangeAndGenerateID("institute_name", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Institute" />
                </SelectTrigger>
                <SelectContent>
                  {institute_name?.map((choice: any, index: number) => (
                    <SelectItem key={index} value={choice.name}>
                      {choice.name} - {choice.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.institute_name &&
                formik.errors.institute_name && (
                  <p className="text-sm text-red-600">
                    {formik.errors.institute_name as string}
                  </p>
                )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center py-3">
          {!isCustomMode ? (
            <p className="text-xs">
              ID will be auto-generated when both are selected
            </p>
          ) : (
            <p className="text-xs">
              ID will be Transferred If Already Not Exist Same ID
            </p>
          )}

          <Button type="submit" className="">
            {isUpdating ? "Updating" : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
