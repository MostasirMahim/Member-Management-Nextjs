"use client"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Ban, Check, Send } from "lucide-react"
import { Button } from "../ui/button"
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
import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { Bounce } from "react-toastify"

interface Props {
  data: any
}

function EmailConfigTable({ data }: Props) {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
  const [deleteConfigId, setDeleteConfigId] = useState(null)
  const router = useRouter()
  const emailConfigs = data?.data

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/api/mails/v1/configs/${deleteConfigId}/`)
      const data = response.data
      toast.success("Config deleted successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      })
      router.refresh()
    } catch (error) {
      console.log(error)
      alert("Something went wrong")
    }
  }

  return (
    <div className="w-full p-4">
      <AlertDialog open={openDeleteAlert} onOpenChange={setOpenDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the email configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfigId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Config
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full overflow-x-auto rounded-md border bg-background">
        <Table className="min-w-[1800px]">
          <TableCaption>
            <div className="flex items-center justify-center gap-2 text-foreground">
              <Send className="h-5 w-5" />
              <h4 className="font-semibold">Email Configuration Settings</h4>
            </div>
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-center text-foreground font-bold">ID</TableHead>
              <TableHead className="text-center text-foreground font-bold">Is Active</TableHead>
              <TableHead className="text-center text-foreground font-bold">Name</TableHead>
              <TableHead className="text-center text-foreground font-bold">Provider</TableHead>
              <TableHead className="text-center text-foreground font-bold">Host</TableHead>
              <TableHead className="text-center text-foreground font-bold">Port</TableHead>
              <TableHead className="text-center text-foreground font-bold">Username</TableHead>
              <TableHead className="text-center text-foreground font-bold">Password</TableHead>
              <TableHead className="text-center text-foreground font-bold">TLS</TableHead>
              <TableHead className="text-center text-foreground font-bold">SSL</TableHead>
              <TableHead className="text-center text-foreground font-bold">AWS Access Key ID</TableHead>
              <TableHead className="text-center text-foreground font-bold">AWS Secret Access Key</TableHead>
              <TableHead className="text-center text-foreground font-bold">AWS Region</TableHead>
              <TableHead className="text-center text-foreground font-bold">SES Configuration Set</TableHead>
              <TableHead className="text-center text-foreground font-bold">IAM Role ARN</TableHead>
              <TableHead className="text-center text-foreground font-bold">Tracking</TableHead>
              <TableHead className="text-center text-foreground font-bold">User</TableHead>
              <TableHead className="text-center text-foreground font-bold">Created At</TableHead>
              <TableHead className="text-center text-foreground font-bold">Updated At</TableHead>
              <TableHead className="text-center text-foreground font-bold">Update</TableHead>
              <TableHead className="text-center text-foreground font-bold">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emailConfigs.map((config: any, index: number) => (
              <TableRow key={index} className="hover:bg-muted/50 transition-colors border-b border-border">
                <TableCell className="text-center text-foreground font-medium">{config.id}</TableCell>
                <TableCell className="text-center">
                  {config.is_active ? (
                    <span className="text-green-700 dark:text-green-400 font-semibold flex justify-center">
                      <Check className="h-5 w-5" />
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 font-semibold flex justify-center">
                      <Ban className="h-5 w-5" />
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center capitalize text-foreground">{config.name || "—"}</TableCell>
                <TableCell className="text-center capitalize text-foreground">{config.provider || "—"}</TableCell>
                <TableCell className="text-center capitalize text-foreground">{config.host || "—"}</TableCell>
                <TableCell className="text-center capitalize text-foreground">{config.port || "—"}</TableCell>
                <TableCell className="text-center capitalize text-foreground">{config.username || "—"}</TableCell>
                <TableCell className="text-center capitalize text-foreground">{config.password || "—"}</TableCell>
                <TableCell className="text-center">
                  {config.use_tls ? (
                    <span className="text-green-600 dark:text-green-400 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-500 dark:text-red-400 font-semibold">No</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {config.use_ssl ? (
                    <span className="text-green-600 dark:text-green-400 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-500 dark:text-red-400 font-semibold">No</span>
                  )}
                </TableCell>
                <TableCell className="text-center capitalize text-foreground">
                  {config.aws_access_key_id || "—"}
                </TableCell>
                <TableCell className="text-center capitalize text-foreground">
                  {config.aws_secret_access_key || "—"}
                </TableCell>
                <TableCell className="text-center capitalize text-foreground">{config.aws_region || "—"}</TableCell>
                <TableCell className="text-center capitalize text-foreground">
                  {config.ses_configuration_set || "—"}
                </TableCell>
                <TableCell className="text-center capitalize text-foreground">{config.iam_role_arn || "—"}</TableCell>
                <TableCell className="text-center">
                  {config.enable_tracking ? (
                    <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                      Enabled
                    </span>
                  ) : (
                    <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium">
                      Disabled
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center capitalize text-foreground">{config.user || "—"}</TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {new Date(config.created_at).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {new Date(config.updated_at).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="default" disabled>
                    Update
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setDeleteConfigId(config.id)
                      setOpenDeleteAlert(true)
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default EmailConfigTable
