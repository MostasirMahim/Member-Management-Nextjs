"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { DollarSign, Ban, MoreVertical, Eye } from "lucide-react"; // Or similar icon library

import Link from "next/link";
import { PaginationPages } from "@/components/utils/PaginationPages";

interface Props {
  data: any;
}

export default function ViewMemberAccountTable({ data }: Props) {
  const dues = data?.data;
  const paginationData = data?.pagination;

  return (
    <div>
      <div className="grid w-full [&>div]:max-h-[500px] [&>div]:border [&>div]:rounded">
        <Table>
          <TableHeader>
            <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
              <TableHead className="pl-4">ID</TableHead>
              <TableHead className="w-[100px]">Member</TableHead>
              <TableHead>balance</TableHead>
              <TableHead>total_credits</TableHead>
              <TableHead>total_debits</TableHead>
              <TableHead>last_transaction_date</TableHead>
              <TableHead>status</TableHead>
              <TableHead>overdue_amount</TableHead>
              <TableHead>due_date</TableHead>
              <TableHead>notes</TableHead>
              <TableHead>credit_limit</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-x-auto">
            {dues?.map((due: any) => (
              <CustomTableRow key={due.id} data={due} />
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationPages pagination={paginationData} />
    </div>
  );
}

const CustomTableRow = ({ data }: Props) => {
  const [amount, setAmount] = useState(0);
  const router = useRouter();

  const handleSubmit = async (member_ID: any) => {
    if (amount <= 0) {
      toast.error("Invalid amount");
      return;
    }
    toast.info("Recharge process started!");
    try {
      const data = {
        amount,
        member_ID,
      };
      const response = await axiosInstance.post(
        "/api/member_financial/v1/member_accounts/recharge/",
        data
      );
      if (response.status == 200) {
        toast.success("Amount recharged successfully");
        router.refresh();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const { id, member } = data;

  // Function to format dates
  const formatDate = (dateString: any) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <TableRow>
      <TableCell className="pl-4  text-gray-500">{id}</TableCell>
      <TableCell className=" text-gray-900 font-bold min-w-3">
        {member}
      </TableCell>

      {/* Financials Column */}
      <TableCell className=" text-gray-800">
        <div className="flex items-center">
          <p className="font-bold flex justify-center items-center">
            <DollarSign className="mr-1 h-4 w-4 text-green-500 " />
            {`${data.balance}`}
          </p>
        </div>
      </TableCell>
      <TableCell className="font-semibold text-red-600">
        <div className="flex items-center">
          <p className="font-bold flex justify-center items-center">
            <DollarSign className="mr-1 h-4 w-4 text-red-600" />
            {data.total_credits}
          </p>
        </div>
      </TableCell>
      <TableCell className="text-gray-600">
        <div className="flex items-center">
          <p className="font-bold flex justify-center items-center">
            <DollarSign className="mr-1 h-4 w-4 text-gray-500" />
            {data.total_debits}
          </p>
        </div>
      </TableCell>

      <TableCell className="text-gray-600">
        {data.last_transaction_date ? (
          formatDate(data.last_transaction_date)
        ) : (
          <Ban />
        )}
      </TableCell>

      {/* Status Cell with Badge */}
      <TableCell>{data.status ? data.status : <Ban />}</TableCell>

      <TableCell className="text-xs text-gray-500">
        {data.overdue_amount}
      </TableCell>
      <TableCell>
        {data.due_date ? formatDate(data.due_date) : <Ban />}
      </TableCell>

      <TableCell className="text-sm text-gray-500">
        {data.notes ? data.notes : "-"}
      </TableCell>
      <TableCell className="text-sm text-gray-500">
        {data.credit_limit ? data.credit_limit : "-"}
      </TableCell>

      {/* Action Cell - Left empty for your buttons like Edit/Delete */}
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-indigo-600"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* View Invoice */}
            <DropdownMenuItem asChild>
              <Link
                href={`/mfm/view_member_accounts/${member}`}
                className="flex items-center text-indigo-600 hover:bg-indigo-100 cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" /> View
              </Link>
            </DropdownMenuItem>
            {/* Payment Invoice */}
            <DropdownMenuItem asChild>
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <DollarSign className="mr-2 h-4 w-4" /> Recharge
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Recharge member account #{member}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter the amount to recharge on the member account.
                      </AlertDialogDescription>
                      <Input
                        value={amount}
                        onChange={(e: any) => setAmount(e.target.value)}
                        type="number"
                        placeholder="Enter amount to recharge"
                      />
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={(e) => handleSubmit(member)}>
                        Submit
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
