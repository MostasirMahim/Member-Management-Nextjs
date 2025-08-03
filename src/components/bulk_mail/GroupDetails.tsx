"use client";

import { Button } from "../ui/button";
import { Ban, Check, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
interface Props {
  data: any;
}
function GroupDetails({ data }: Props) {
  const groupData = data?.data;
  const emailList = data?.data?.email_lists;
  const router = useRouter();
  const handleRemove = async (id: any) => {
    try {
      const response = await axiosInstance.delete(
        `/api/mails/v1/email/lists/${id}/`
      );
      const data = response.data;
      toast.success("Email removed successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.success("Something went wrong", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  return (
    <div className="h-max">
      <div className="h-full p-4 bg-gray-200 dark:bg-gray-800 w-full mb-4">
        <h5 className="font-semibold">
          Group name: <span className="font-bold">{groupData?.name}</span>{" "}
        </h5>
        <h5 className="font-semibold">
          Description:{" "}
          <span className="font-bold">{groupData?.description}</span>
        </h5>
        <h5 className="font-semibold">
          User: <span className="font-bold">{groupData?.user}</span>
        </h5>
        <h5 className="font-semibold">
          Created At:{" "}
          <span className="font-bold">
            {new Date(groupData?.created_at).toLocaleString("en-BD", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </h5>
        <h5 className="font-semibold">
          Updated At:{" "}
          <span className="font-bold">
            {new Date(groupData?.updated_at).toLocaleString("en-BD", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </h5>
        <h5 className="font-semibold">
          Total Emails :{" "}
          <span className="font-bold">{groupData?.email_lists.length}</span>
        </h5>
      </div>
      <div>
        <Table>
          <TableCaption>
            <div>
              <h4 className="flex items-center justify-center">Email list</h4>
            </div>
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-200 dark:bg-gray-800">
              <TableHead className="">ID</TableHead>
              <TableHead className="">email</TableHead>
              <TableHead className="">is subscribed</TableHead>
              <TableHead className="">Remove</TableHead>
              <TableHead className="">Unsubscribe</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emailList.map((email: any) => (
              <TableRow key={email.id}>
                <TableCell>{email.id}</TableCell>
                <TableCell>{email.email || "—"}</TableCell>
                <TableCell className="text-right">
                  {email.is_subscribed ? (
                    <span className="text-green-700 font-semibold">
                      <Check />
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      <Ban />
                    </span>
                  )}
                </TableCell>
                <TableCell className="">
                  <Button
                    variant="destructive"
                    onClick={() => handleRemove(email.id)}
                  >
                    <Trash /> Remove
                  </Button>
                </TableCell>
                <TableCell className="">
                  <Button variant="secondary" disabled>
                    Unsubscribe
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default GroupDetails;
