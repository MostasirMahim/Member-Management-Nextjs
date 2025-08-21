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

import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Ban,
  MoreVertical,
  Eye,
} from "lucide-react"; // Or similar icon library

import Link from "next/link";
import { PaginationPages } from "@/components/utils/PaginationPages";

interface Props {
  data: any;
}

export default function ViewMemberDueTable({ data }: Props) {
  const dues = data?.data;
  const paginationData = data?.pagination;

  return (
    <div>
      <div className="grid w-full [&>div]:max-h-[300px] [&>div]:border [&>div]:rounded">
        <Table>
          <TableHeader>
            <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
              <TableHead className="pl-4">ID</TableHead>
              <TableHead className="w-[100px]">Member</TableHead>
              <TableHead>Amount due</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead>Amount paid</TableHead>
              <TableHead>Payment date</TableHead>
              <TableHead>Overdue amount</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Is due paid</TableHead>
              <TableHead>Due reference</TableHead>
              <TableHead>is active</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Updated at</TableHead>
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

  // Use a status badge for clarity on the payment status
  const statusBadge = is_due_paid ? (
    <Badge variant="default" className="bg-green-100 text-green-700">
      <CheckCircle className="mr-1 h-3 w-3" />
      Paid
    </Badge>
  ) : isOverdue ? (
    <Badge variant="destructive" className="bg-red-100 text-red-700">
      <XCircle className="mr-1 h-3 w-3" />
      Overdue
    </Badge>
  ) : (
    <Badge className="bg-yellow-100 text-yellow-700">
      <Clock className="mr-1 h-3 w-3" />
      Pending
    </Badge>
  );

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
            {`${amount_due}`}
          </p>
        </div>
      </TableCell>
      <TableCell className="text-gray-600">{formatDate(due_date)}</TableCell>
      <TableCell className="text-gray-600">
        <div className="flex items-center">
          <p className="font-bold flex justify-center items-center">
            <DollarSign className="mr-1 h-4 w-4 text-gray-500" />
            {amount_paid !== "0.00" ? `${amount_paid}` : "-"}
          </p>
        </div>
      </TableCell>
      <TableCell className="text-gray-600">
        {payment_date ? formatDate(payment_date) : "-"}
      </TableCell>
      <TableCell className="font-semibold text-red-600">
        {overdue_amount !== "0.00" ? `${overdue_amount}` : <Ban />}
      </TableCell>
      <TableCell className="text-gray-600">{notes || <Ban />}</TableCell>

      {/* Status Cell with Badge */}
      <TableCell>{statusBadge}</TableCell>

      <TableCell className="text-xs text-gray-500">{due_reference}</TableCell>
      <TableCell>
        <span
          className={`h-2.5 w-2.5 rounded-full block ${
            is_active ? "bg-green-500" : "bg-gray-400"
          }`}
        ></span>
      </TableCell>

      <TableCell className="text-sm text-gray-500">
        {formatDate(created_at)}
      </TableCell>
      <TableCell className="text-sm text-gray-500">
        {formatDate(updated_at)}
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
                href={`/mfm/view_member_dues/${id}`}
                className="flex items-center text-indigo-600 hover:bg-indigo-100 cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" /> View
              </Link>
            </DropdownMenuItem>
            {/* Payment Invoice */}
            <DropdownMenuItem asChild>
              <Link
                href={`/mfm/pay_member_due/${id}`}
                className="flex items-center text-sky-600 hover:bg-indigo-100 cursor-pointer"
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
