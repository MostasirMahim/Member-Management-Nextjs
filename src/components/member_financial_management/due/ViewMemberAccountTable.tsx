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

import { DollarSign, Ban, MoreVertical, Eye } from "lucide-react";
import Link from "next/link";

// ✅ import SmartPagination
import { SmartPagination } from "@/components/utils/SmartPagination";

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
              <TableHead>Balance</TableHead>
              <TableHead>Total Credits</TableHead>
              <TableHead>Total Debits</TableHead>
              <TableHead>Last Transaction</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Overdue Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Credit Limit</TableHead>
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

      {/* ✅ SmartPagination Used Here */}
      <SmartPagination paginationData={paginationData} />
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
      const requestData = {
        amount,
        member_ID,
      };
      const response = await axiosInstance.post(
        "/api/member_financial/v1/member_accounts/recharge/",
        requestData
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
      {/* ID */}
      <TableCell className="pl-4 text-muted-foreground">{id}</TableCell>

      {/* Member */}
      <TableCell className="font-semibold text-foreground">{member}</TableCell>

      {/* Balance */}
      <TableCell>
        <div className="flex items-center font-semibold text-green-600 dark:text-green-400">
          <DollarSign className="mr-1 h-4 w-4" />
          {data.balance}
        </div>
      </TableCell>

      {/* Total Credits */}
      <TableCell>
        <div className="flex items-center font-semibold text-blue-600 dark:text-blue-400">
          <DollarSign className="mr-1 h-4 w-4" />
          {data.total_credits}
        </div>
      </TableCell>

      {/* Total Debits */}
      <TableCell>
        <div className="flex items-center font-semibold text-red-600 dark:text-red-400">
          <DollarSign className="mr-1 h-4 w-4" />
          {data.total_debits}
        </div>
      </TableCell>

      {/* Last Transaction */}
      <TableCell className="text-sm text-muted-foreground">
        {data.last_transaction_date ? (
          formatDate(data.last_transaction_date)
        ) : (
          <Ban />
        )}
      </TableCell>

      {/* Status */}
      <TableCell>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            data.status === "Active"
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {data.status ? data.status : "N/A"}
        </span>
      </TableCell>

      {/* Overdue Amount */}
      <TableCell className="text-sm text-destructive">
        {data.overdue_amount}
      </TableCell>

      {/* Due Date */}
      <TableCell className="text-sm text-muted-foreground">
        {data.due_date ? formatDate(data.due_date) : <Ban />}
      </TableCell>

      {/* Notes */}
      <TableCell className="text-sm text-muted-foreground">
        {data.notes ? data.notes : "-"}
      </TableCell>

      {/* Credit Limit */}
      <TableCell className="text-sm text-muted-foreground">
        {data.credit_limit ? data.credit_limit : "-"}
      </TableCell>

      {/* Action Dropdown */}
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* View Invoice */}
            <DropdownMenuItem asChild>
              <Link
                href={`/mfm/view_member_accounts/${member}`}
                className="flex items-center text-primary hover:bg-accent cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" /> View
              </Link>
            </DropdownMenuItem>

            {/* Recharge */}
            <DropdownMenuItem asChild>
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
                    <AlertDialogAction onClick={() => handleSubmit(member)}>
                      Submit
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
