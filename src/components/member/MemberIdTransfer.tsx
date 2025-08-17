"use client";
import React, { useState } from "react";
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
import { RefreshCw, Edit3 } from 'lucide-react';
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import useGetAllChoice from "@/hooks/data/useGetAllChoice";
import useGetMember from "@/hooks/data/useGetMember";
import { useAddMemberStore } from "@/store/store";
import { LoadingCard } from "../ui/loading";
import { useParams } from "next/navigation";

const validationSchema = Yup.object({
  member_ID: Yup.string().required("Member ID is required"),
  membership_type: Yup.string().required("Membership type is required"),
  institute_name: Yup.string().required("Institute name is required"),
});

export default function MemberIdTransfer() {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const { memberID,  setMemberID } = useAddMemberStore();
  const isUpdateMode = false;
  const params = useParams();
  console.log(params);
  const { data: choiceSections, isLoading } = useGetAllChoice();
  const { data, isLoading: isLoadingMember } = useGetMember(memberID, {
    enabled: isUpdateMode && !!memberID,
  });

  const { member_info: memberData } = data ?? {};
  const {
    membership_type,
    institute_name,
  } = choiceSections ?? {};

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
          formik.setFieldValue("member_ID", member_ID);
          setMemberID(member_ID);
        }
        toast.success("Member ID generated successfully");
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

  const { mutate: setCustomID, isPending: isSettingCustom } = useMutation({
    mutationFn: async (customIdData: any) => {
      const res = await axiosInstance.post(
        `/api/member/v1/members/set_custom_id/`,
        customIdData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        toast.success("Custom ID set successfully");
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      if (errors && typeof errors === "object") {
        Object.entries(errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            formik.setFieldError(field, messages[0]);
          }
        });
        toast.error(detail || message || "Set Custom ID Failed");
      } else {
        toast.error(detail || message || "Set Custom ID Failed");
      }
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      isUpdateMode && memberData
        ? {
            member_ID: memberData.member_ID || "",
            membership_type: memberData.membership_type?.name || "",
            institute_name: memberData.institute_name?.name || "",
          }
        : {
            member_ID: memberID || "",
            membership_type: "",
            institute_name: "",
          },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form submitted:", values);
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
      otherFieldTrimmed !== "" &&
      !isCustomMode &&
      !isUpdateMode
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

  const handleCustomIdSave = () => {
    if (formik.values.member_ID.trim()) {
      const data = {
        custom_id: formik.values.member_ID.trim(),
        membership_type: formik.values.membership_type,
        institute_name: formik.values.institute_name,
      };
      setCustomID(data);
      setMemberID(formik.values.member_ID.trim());
    }
  };

  const handleRegenerateId = () => {
    if (formik.values.membership_type && formik.values.institute_name) {
      const data = {
        membership_type: formik.values.membership_type,
        institute_name: formik.values.institute_name,
      };
      generateID(data);
    } else {
      toast.error("Please select both membership type and institute name first");
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
            onCheckedChange={setIsCustomMode}
            disabled={isUpdateMode}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 ">
          <Label className="text-sm font-medium ">Current Member ID</Label>
          <div className="flex gap-2">
            <Input
              value={formik.values.member_ID}
              onChange={(e) => formik.setFieldValue("member_ID", e.target.value)}
              placeholder="Member ID"
              disabled
              className="flex-1"
            />
          </div>
          {formik.touched.member_ID && formik.errors.member_ID && (
            <p className="text-sm text-red-600">
              {formik.errors.member_ID as string}
            </p>
          )}
        </div>
        <div className="space-y-2 ">
          <Label className="text-sm font-medium ">Tranferred Member ID</Label>
          <div className="flex gap-2">
            <Input
              value={formik.values.member_ID}
              onChange={(e) => formik.setFieldValue("member_ID", e.target.value)}
              placeholder="Member ID"
              disabled={!isCustomMode || isUpdateMode}
              className="flex-1"
            />
          
          </div>
          {formik.touched.member_ID && formik.errors.member_ID && (
            <p className="text-sm text-red-600">
              {formik.errors.member_ID as string}
            </p>
          )}
        </div>
        {!isCustomMode && <div className="space-y-2">
          <Label className="text-sm font-medium ">
            Membership Type
          </Label>
          <Select
            value={formik.values.membership_type}
            onValueChange={(value) => handleFieldChangeAndGenerateID("membership_type", value)}
            disabled={isUpdateMode}
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
          {formik.touched.membership_type && formik.errors.membership_type && (
            <p className="text-sm text-red-600">
              {formik.errors.membership_type as string}
            </p>
          )}
        </div>}

        {!isCustomMode && <div className="space-y-2">
          <Label className="text-sm font-medium">
            Institute Name
          </Label>
          <Select
            value={formik.values.institute_name}
            onValueChange={(value) => handleFieldChangeAndGenerateID("institute_name", value)}
            disabled={isUpdateMode}
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
          {formik.touched.institute_name && formik.errors.institute_name && (
            <p className="text-sm text-red-600">
              {formik.errors.institute_name as string}
            </p>
          )}
        </div>}
      </div>

      <div className="flex justify-between items-center">
        {!isCustomMode ? (
        <p className="text-xs">
          ID will be auto-generated when both are selected
        </p>
      ) : (
        <p className="text-xs">
          ID will be Transferred If Already Not Exist Same ID
        </p>
      )}

      <Button
        type="submit"
    
        className=""
      >
        Update
      </Button>
      </div>
    </div>
  );
}