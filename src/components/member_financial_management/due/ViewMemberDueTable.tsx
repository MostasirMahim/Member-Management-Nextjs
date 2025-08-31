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
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Ban,
  MoreVertical,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { SmartPagination } from "@/components/utils/SmartPagination"; 

interface Props {
  data: any;
}

export default function ViewMemberDueTable({ data }: Props) {
  const dues = data?.data;
  const paginationData = data?.pagination;
  console.log("pagination data:", paginationData);


  return (
    <div className="w-full">
      <div className="grid w-full [&>div]:max-h-[600px] [&>div]:border [&>div]:rounded overflow-x-auto">
        <Table className="dark:text-white">
          <TableHeader className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
            <TableRow className="[&>*]:whitespace-nowrap">
              <TableHead className="pl-4 text-gray-700 dark:text-gray-200">ID</TableHead>
              <TableHead className="w-[100px] text-gray-700 dark:text-gray-200">Member</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">Amount due</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">Due date</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">Amount paid</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">Payment date</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">Overdue amount</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">Notes</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">Is due paid</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">Due reference</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">is active</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">Created at</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">Updated at</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dues?.map((due: any) => (
              <CustomTableRow key={due.id} data={due} />
            ))}
          </TableBody>
        </Table>
      </div>

      <SmartPagination paginationData={paginationData} className="mt-5" />
    </div>
  );
}

const CustomTableRow = ({ data }: Props) => {
  const {
    id,
    member,
    amount_due,
    due_date,
    amount_paid,
    payment_date,
    overdue_amount,
    notes,
    is_due_paid,
    due_reference,
    is_active,
    created_at,
    updated_at,
  } = data;

  const isOverdue = new Date(due_date) < new Date() && !is_due_paid;

  const statusBadge = is_due_paid ? (
    <Badge className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 flex items-center gap-1">
      <CheckCircle className="h-3 w-3" /> Paid
    </Badge>
  ) : isOverdue ? (
    <Badge className="bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100 flex items-center gap-1">
      <XCircle className="h-3 w-3" /> Overdue
    </Badge>
  ) : (
    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-yellow-100 flex items-center gap-1">
      <Clock className="h-3 w-3" /> Pending
    </Badge>
  );

  const formatDate = (dateString: any) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <TableRow className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
      <TableCell className="pl-4 text-gray-700 dark:text-gray-300">{id}</TableCell>
      <TableCell className="font-bold text-gray-900 dark:text-white">{member}</TableCell>
      <TableCell className="text-gray-800 dark:text-gray-200 flex items-center">
        <DollarSign className="mr-1 h-4 w-4 text-green-500 dark:text-green-400" /> {amount_due}
      </TableCell>
      <TableCell className="text-gray-600 dark:text-gray-400">{formatDate(due_date)}</TableCell>
      <TableCell className="text-gray-600 dark:text-gray-400 flex items-center">
        <DollarSign className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-300" />{" "}
        {amount_paid !== "0.00" ? amount_paid : "-"}
      </TableCell>
      <TableCell className="text-gray-600 dark:text-gray-400">
        {payment_date ? formatDate(payment_date) : "-"}
      </TableCell>
      <TableCell className="font-semibold text-red-600 dark:text-red-400">
        {overdue_amount !== "0.00" ? overdue_amount : <Ban />}
      </TableCell>
      <TableCell className="text-gray-600 dark:text-gray-400">{notes || <Ban />}</TableCell>
      <TableCell>{statusBadge}</TableCell>
      <TableCell className="text-xs text-gray-500 dark:text-gray-400">{due_reference}</TableCell>
      <TableCell>
        <span
          className={`h-2.5 w-2.5 rounded-full block ${
            is_active ? "bg-green-500" : "bg-gray-400 dark:bg-gray-600"
          }`}
        ></span>
      </TableCell>
      <TableCell className="text-sm text-gray-500 dark:text-gray-400">{formatDate(created_at)}</TableCell>
      <TableCell className="text-sm text-gray-500 dark:text-gray-400">{formatDate(updated_at)}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/mfm/view_member_dues/${id}`}
                className="flex items-center text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" /> View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/mfm/pay_member_due/${id}`}
                className="flex items-center text-sky-600 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer"
              >
                <DollarSign className="mr-2 h-4 w-4" /> Pay due
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
