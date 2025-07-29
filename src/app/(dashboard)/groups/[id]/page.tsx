"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, Plus, UserPlus, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddPermissionForm } from "@/components/groups/AddPermit";
import { AddMemberForm } from "@/components/groups/AddUserGP";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "@/hooks/use-toast";

export default function GroupDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [addPermissionDialogOpen, setAddPermissionDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"member" | "permission">(
    "member"
  );

  const [deleteTarget, setDeleteTarget] = useState<{
    id?: number;
    name: string;
  } | null>(null);

  const { data: GROUP, isLoading } = useQuery({
    queryKey: ["getGroup", id],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          `/api/account/v1/authorization/groups/${id}/`
        );
        if (res?.data?.status == "success") {
          return res.data.data;
        } else {
          console.error("Failed to fetch groups:", res.data.message);
          toast({
            title: "Error",
            description: res.data.message || "Failed to fetch group details",
            variant: "destructive",
          });
          return [];
        }
      } catch (error: any) {
        console.error("Error fetching user stats:", error);
        toast({
          title: "Error",
          description:
            error?.response?.data?.message || "Failed to fetch groups",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const { mutate: removeUser, isPending: removePending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.delete(
        "/api/account/v1/authorization/assign_group_user/",
        { data }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["getGroup"] });
        toast({
          title: data?.details || "Users Removed successfully",
          description: data?.message || "Users has been successfully Removed.",
          variant: "default",
        });
        setDeleteDialogOpen(false);
        setDeleteTarget(null);
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      if (errors) {
        const allErrors = Object.values(errors).flat().join("\n");
        toast({
          title: "Users Removed Failed",
          description: allErrors,
          variant: "destructive",
        });
      } else {
        toast({
          title: detail || "Users Removed Failed",
          description: message || "An error occurred during Removed",
          variant: "destructive",
        });
      }
    },
  });

  const { mutate: removePermit, isPending: removePermitPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.delete(
        `/api/account/v1/authorization/group_permissions/`,
        { data }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["getGroup"] });
        toast({
          title: data?.details || "Permission Removed successfully",
          description:
            data?.message || "Permission has been successfully Removed.",
          variant: "default",
        });
        setDeleteDialogOpen(false);
        setDeleteTarget(null);
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      if (errors) {
        const allErrors = Object.values(errors).flat().join("\n");
        toast({
          title: "Permission Removed Failed",
          description: allErrors,
          variant: "destructive",
        });
      } else {
        toast({
          title: detail || "Permission Removed Failed",
          description: message || "An error occurred during Removed",
          variant: "destructive",
        });
      }
    },
  });

  const handleDeleteMember = (member: any) => {
    setDeleteType("member");
    setDeleteTarget({ id: member.id, name: member.username });
    setDeleteDialogOpen(true);
  };

  const handleDeletePermission = (permission: any) => {
    setDeleteType("permission");
    setDeleteTarget({ name: permission.name, id: permission.id });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      toast({
        title: "Sorry, Invalid Action",
        description: "Target Action Not found",
        variant: "destructive",
      });
      return;
    }

    if (deleteType === "member" && deleteTarget.id) {
      removeUser({ user_id: deleteTarget.id, group_id: parseInt(id) });
    } else if (deleteType === "permission" && deleteTarget.id) {
      removePermit({ permission: deleteTarget.id, group: parseInt(id) });
    }
  };

  if (!GROUP) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Group Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The group you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/groups")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Groups
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {GROUP?.group?.name || "Group Name"}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-fit ">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Users: {GROUP?.users?.length}
              </CardTitle>
              <Button size="sm" onClick={() => setAddMemberDialogOpen(true)}>
                <UserPlus className="w-4 h-4 " />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[450px] overflow-y-auto">
            {GROUP?.users?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No members in this group</p>
              </div>
            ) : (
              GROUP?.users?.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1 space-y-1">
                    <div className="font-medium">
                      {member.first_name + " " + member.last_name}{" "}
                      <span className="font-normal text-sm italic">
                        {member.username}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {member.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs mt-1">
                        {member.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="text-xs ">
                        {member.is_staff ? "Staff" : "User"}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteMember(member)}
                  >
                    Remove
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="h-fit ">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                Permissions: {GROUP?.permissions?.length}
              </CardTitle>
              <Button
                size="sm"
                onClick={() => setAddPermissionDialogOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Permission
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[450px] overflow-y-auto">
            {GROUP?.permissions?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <KeyRound className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No permissions assigned</p>
              </div>
            ) : (
              GROUP?.permissions?.map((permission: any) => (
                <div
                  key={permission.id}
                  className="flex items-center justify-between p-3 border rounded-lg "
                >
                  <div className="font-mono text-sm">{permission.name}</div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePermission(permission)}
                  >
                    Remove
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the{" "}
              {deleteType}{" "}
              <span className="font-semibold">"{deleteTarget?.name}"</span> from
              this group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {deleteType === "member" ? "Member" : "Permission"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-fit">
          <DialogHeader>
            <DialogTitle>
              Add users to {GROUP?.group?.name || "Group"}
            </DialogTitle>
          </DialogHeader>
          <AddMemberForm
            groupId={id}
            onCancel={() => setAddMemberDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={addPermissionDialogOpen}
        onOpenChange={setAddPermissionDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Permissions to Group</DialogTitle>
          </DialogHeader>
          <AddPermissionForm
            existingPermissions={GROUP?.permissions || []}
            groupId={id}
            onCancel={() => setAddPermissionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
