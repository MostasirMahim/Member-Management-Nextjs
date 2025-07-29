"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Eye, Trash2, Users, Shield, User, ShieldCheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateGroupForm } from "@/components/groups/CreateGroupForms"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/lib/axiosInstance"
import { toast } from "@/hooks/use-toast"
import useGetGroups from "@/hooks/data/useGetGroups"



const dummyGroups = [
  {
    id: 1,
    name: "super_admin",
    totalPermissions: 20,
    description: "Full system access with all administrative privileges",
    permissions: [
      "member_financial_management",
      "members/add",
      "members/view",
      "members/edit",
      "members/delete",
      "groups/manage",
      "reports/view",
      "settings/manage",
    ],
  },
  {
    id: 2,
    name: "moderator",
    totalPermissions: 12,
    description: "Content moderation and user management",
    permissions: ["members/view", "members/edit", "content/moderate", "reports/view", "groups/view"],
  },
  {
    id: 3,
    name: "editor",
    totalPermissions: 8,
    description: "Content creation and editing capabilities",
    permissions: ["content/create", "content/edit", "content/publish", "media/upload"],
  },
  {
    id: 4,
    name: "viewer",
    totalPermissions: 3,
    description: "Read-only access to basic content",
    permissions: ["content/view", "profile/view", "dashboard/access"],
  },
]

export default function GroupsPage() {
  const router = useRouter()
  const [groups, setGroups] = useState(dummyGroups)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<(typeof dummyGroups)[0] | null>(null)
  const queryClient = useQueryClient();
    const { data: GROUPS, isLoading } = useGetGroups();

     

    console.log("Groups fetched from API:", GROUPS);

  const handleView = (groupId: number) => {
    router.push(`/groups/${groupId}`)
  }

  const handleDeleteClick = (group: (typeof dummyGroups)[0]) => {
    setSelectedGroup(group)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedGroup) {
      setGroups(groups.filter((group) => group.id !== selectedGroup.id))
      setDeleteDialogOpen(false)
      setSelectedGroup(null)
    }
  }

  const handleCreateGroup = (newGroup: { name: string; permissions: string[] }) => {
    const group = {
      id: Math.max(...groups.map((g) => g.id)) + 1,
      name: newGroup.name,
      totalPermissions: newGroup.permissions.length,
      description: `Custom group with ${newGroup.permissions.length} permissions`,
      permissions: newGroup.permissions,
    }
    setGroups([...groups, group])
    setCreateDialogOpen(false)
  }

  return (
    <div className=" mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">View All Groups</h1>
          <p className="text-muted-foreground">Manage user groups and their permissions</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="w-fit">
          <Plus className="w-4 h-4" />
          Create Group
        </Button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GROUPS?.map((group:any) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">{group.name}</CardTitle>
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="w-fit">
                ID: {group.id}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3 my-2">
           

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total member: 20</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Permissions: {group?.permission.length}</span>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleView(group.id)} className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(group)} className="flex-1">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {GROUPS?.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No groups found</h3>
          <p className="text-muted-foreground mb-4">Create your first group to get started</p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the group{" "}
              <span className="font-semibold">"{selectedGroup?.name}"</span> and remove all associated permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Group Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create A Group</DialogTitle>
          </DialogHeader>
          <CreateGroupForm onSubmit={handleCreateGroup} onCancel={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
