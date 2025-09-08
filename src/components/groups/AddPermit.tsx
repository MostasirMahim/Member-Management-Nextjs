"use client";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetPermit from "@/hooks/data/useGetPermit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { LoadingDots } from "../ui/loading";
import { toast } from "react-toastify";

interface AddPermissionFormProps {
  existingPermissions: string[];
  groupId: string;
  onCancel: () => void;
}

export function AddPermissionForm({
  existingPermissions,
  groupId,
  onCancel,
}: AddPermissionFormProps) {
  const { data: ALL_PERMITION, isLoading: isLoadingPermissions } =
    useGetPermit();
  const queryClient = useQueryClient();

  const ALL_PERMIT = ALL_PERMITION?.filter(
    (permit2: any) =>
      !existingPermissions.some((permit: any) => permit.id === permit2.id)
  );

  const { mutate: addedPermit, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.patch(
        `/api/account/v2/authorization/group_permissions/${groupId}/`,
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["getGroup"] });
        toast.success("Permissions Added Successfully");
        formik.resetForm();
        onCancel();
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      if (errors) {
        const allErrors = Object.values(errors).flat().join("\n");
       toast.error(allErrors || "Permissions Added Failed");
      } else {
        toast.error(detail || message || "Permissions Added Failed");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      selectedPermissions: [] as string[],
    },
    onSubmit: async (values) => {
      if (values.selectedPermissions) {
        addedPermit({ permission: values.selectedPermissions });
      } else {
        toast.error("Please select at least one permission");
      }
    },
  });

  const handlePermissionChange = (permission: any, checked: boolean) => {
    const currentPermissions = formik.values.selectedPermissions;

    if (checked) {
      formik.setFieldValue("selectedPermissions", [
        ...currentPermissions,
        permission.id,
      ]);
    } else {
      formik.setFieldValue(
        "selectedPermissions",
        currentPermissions.filter((p) => p !== permission.id)
      );
    }
  };

  const selectAll = () => {
    formik.setFieldValue(
      "selectedPermissions",
      ALL_PERMIT?.map((p: any) => p.id)
    );
  };

  const clearAll = () => {
    formik.setFieldValue("selectedPermissions", []);
  };

  if (isLoadingPermissions) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">
            Loading permissions...
          </p>
        </div>
      </div>
    );
  }
  if (isLoadingPermissions) return <LoadingDots />;

  return (
    <div className="w-full mx-auto">
      <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <Label className="text-base font-semibold">
              Available Permissions
            </Label>
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
            Selected: {formik.values.selectedPermissions.length} of{" "}
            {ALL_PERMIT?.length || 0} permissions
          </div>

          <ScrollArea className="h-[250px] sm:h-[300px] border rounded-md p-3 sm:p-4">
            <div className="space-y-2 sm:space-y-3">
              {ALL_PERMIT?.map((permission: any) => (
                <div
                  key={permission.id}
                  className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded"
                >
                  <Checkbox
                    id={permission.id}
                    checked={formik.values.selectedPermissions.includes(
                      permission.id
                    )}
                    onCheckedChange={(checked) =>
                      handlePermissionChange(permission, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={permission.name}
                    className="text-xs sm:text-sm font-mono cursor-pointer flex-1 leading-tight"
                  >
                    {permission.name}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

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
            disabled={
              formik.values.selectedPermissions.length === 0 ||
              formik.isSubmitting
            }
            className="w-full sm:w-auto"
          >
            {formik.isSubmitting
              ? "Adding..."
              : `Add ${formik.values.selectedPermissions.length} Permission${
                  formik.values.selectedPermissions.length !== 1 ? "s" : ""
                }`}
          </Button>
        </div>
      </form>
    </div>
  );
}
