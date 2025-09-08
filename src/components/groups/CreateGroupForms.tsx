"use client";

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useGetPermit from "@/hooks/data/useGetPermit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { LoadingDots } from "../ui/loading";
import { toast } from "react-toastify";

interface CreateGroupFormProps {
  onCancel: () => void;
}

export function CreateGroupForm({ onCancel }: CreateGroupFormProps) {
  const { data: ALL_PERMIT, isLoading: isLoadingPermissions } = useGetPermit();
  const queryClient = useQueryClient();

  const { mutate: createGroup, isPending } = useMutation({
    mutationFn: async (groupData: any) => {
      const res = await axiosInstance.post(
        "/api/account/v1/authorization/group_permissions/",
        groupData
      );
      return res.data;
    },
    onSuccess: async(data) => {
      if (data?.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["getGroups"] });
        toast.success("Group Added Successfully");

        formik.resetForm();
        onCancel();
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      if (errors) {
        const allErrors = Object.values(errors).flat().join("\n");
        toast.error(allErrors || "Users Added Failed");
      } else {
        toast.error(detail || message || "Users Added Failed");
      }
    },
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      permissions: [] as string[],
    },
    validate: (values) => {
      const errors: { name?: string; permissions?: string } = {};

      if (!values.name.trim()) {
        errors.name = "Group name is required";
      }

      if (values.permissions.length === 0) {
        errors.permissions = "At least one permission must be selected";
      }

      return errors;
    },
    onSubmit: async (values) => {
      createGroup({ name: values.name, permission: values.permissions });
    },
  });

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const currentPermissions = formik.values.permissions;

    if (checked) {
      formik.setFieldValue("permissions", [
        ...currentPermissions,
        permissionId,
      ]);
    } else {
      formik.setFieldValue(
        "permissions",
        currentPermissions.filter((id) => id !== permissionId)
      );
    }
  };

  const selectAll = () => {
    formik.setFieldValue(
      "permissions",
      ALL_PERMIT?.map((p: any) => p.id)
    );
  };

  const clearAll = () => {
    formik.setFieldValue("permissions", []);
  };
  if (isLoadingPermissions) return <LoadingDots />;
  return (
    <div className="w-full mx-auto">
      <form onSubmit={formik.handleSubmit} className="space-y-2 sm:space-y-3">
        <div className="space-y-2">
          <Label htmlFor="name">Group Name</Label>
          <Input
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter group name"
            className={
              formik.touched.name && formik.errors.name ? "border-red-500" : ""
            }
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-red-500">{formik.errors.name}</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <Label>Select Permissions</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectAll}
                className="text-xs sm:text-sm bg-transparent"
              >
                Select All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="text-xs sm:text-sm bg-transparent"
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Selected: {formik.values.permissions.length} of {ALL_PERMIT?.length}
          </div>

          {formik.touched.permissions && formik.errors.permissions && (
            <p className="text-sm text-red-500">{formik.errors.permissions}</p>
          )}

          <ScrollArea className="h-[200px] sm:h-[250px] border rounded-md p-3 sm:p-4">
            <div className="space-y-2 sm:space-y-3">
              {ALL_PERMIT?.map((permission: any) => (
                <div
                  key={permission.id}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={permission.id}
                    checked={formik.values.permissions.includes(permission.id)}
                    onCheckedChange={(checked) =>
                      handlePermissionChange(permission.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={permission.id}
                    className="text-xs sm:text-sm font-normal cursor-pointer leading-tight"
                  >
                    {permission.name}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Creating..." : "Create Group"}
          </Button>
        </div>
      </form>
    </div>
  );
}
