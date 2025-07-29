"use client";
import { useFormik } from "formik";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, User, X } from "lucide-react";
import useGetAllUsers from "@/hooks/data/useGetAllusers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "@/hooks/use-toast";

interface AddMemberFormProps {
  groupId: string;
  onCancel: () => void;
}

export function AddMemberForm({ onCancel, groupId }: AddMemberFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: ALL_USERS, isLoading: isLoadinAllUsers } = useGetAllUsers();
  const queryClient = useQueryClient();

  const { mutate: addedMember, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.post(
        "/api/account/v2/authorization/assign_group_user/",
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["getGroup"] });
        toast({
          title: data?.details || "Users Added successfully",
          description: data?.message || "Users has been successfully added.",
          variant: "default",
        });

        formik.resetForm();
        setSearchTerm("");
        onCancel();
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      if (errors) {
        const allErrors = Object.values(errors).flat().join("\n");
        toast({
          title: "Users Added Failed",
          description: allErrors,
          variant: "destructive",
        });
      } else {
        toast({
          title: detail || "Users Added Failed",
          description: message || "An error occurred during Added",
          variant: "destructive",
        });
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      selectedUsers: [] as Array<{ id: number; username: string }>,
    },
    onSubmit: async (values) => {
      const users = values.selectedUsers.map((user) => user.id);
      if (users && groupId) {
        addedMember({ users, group: parseInt(groupId) });
      }
    },
  });

  const filteredUsers = ALL_USERS?.filter((user: any) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (user: { id: number; username: string }) => {
    const isSelected = formik.values.selectedUsers.some(
      (selected) => selected.id === user.id
    );

    if (isSelected) {
      const updatedUsers = formik.values.selectedUsers.filter(
        (selected) => selected.id !== user.id
      );
      formik.setFieldValue("selectedUsers", updatedUsers);
    } else {
      formik.setFieldValue("selectedUsers", [
        ...formik.values.selectedUsers,
        user,
      ]);
    }
  };

  const handleRemoveUser = (userId: number) => {
    const updatedUsers = formik.values.selectedUsers.filter(
      (user) => user.id !== userId
    );
    formik.setFieldValue("selectedUsers", updatedUsers);
  };

  const isUserSelected = (userId: number) => {
    return formik.values.selectedUsers.some((user) => user.id === userId);
  };

  const isFormValid = formik.values.selectedUsers.length > 0;

  return (
    <div className="w-full mx-auto">
      <form onSubmit={formik.handleSubmit} className="space-y-2 sm:space-y-3">
        {formik.values.selectedUsers.length > 0 && (
          <div className="">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Selected Users ({formik.values.selectedUsers.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-[90px] overflow-y-auto ">
              {formik.values.selectedUsers.map((user) => (
                <Badge
                  key={user.id}
                  variant="secondary"
                  className="text-xs px-2 py-1 flex items-center gap-1"
                >
                  <span className="font-mono">{user.username}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.id)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="search">Search Users</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username..."
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Available Users ({filteredUsers?.length})</Label>
          <ScrollArea className="h-[200px] sm:h-[250px] border rounded-md p-2">
            <div className="space-y-1">
              {filteredUsers?.map((user: any) => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`flex items-center gap-2 p-2 sm:p-3 rounded-md cursor-pointer border-b transition-colors hover:bg-muted/50 ${
                    isUserSelected(user.id)
                      ? "bg-primary/10 border border-primary/20"
                      : ""
                  }`}
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm sm:text-base font-mono flex-1">
                    {user.username}
                  </span>
                  {isUserSelected(user.id) && (
                    <Badge variant="default" className="text-xs px-2 py-0.5">
                      Selected
                    </Badge>
                  )}
                </div>
              ))}
              {filteredUsers?.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">
                    No users found matching "{searchTerm}"
                  </p>
                </div>
              )}
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
            disabled={!isFormValid || formik.isSubmitting}
            className="w-full sm:w-auto"
          >
            {isPending
              ? "Adding..."
              : `Add ${formik.values.selectedUsers.length} Member${
                  formik.values.selectedUsers.length !== 1 ? "s" : ""
                }`}
          </Button>
        </div>
      </form>
    </div>
  );
}
