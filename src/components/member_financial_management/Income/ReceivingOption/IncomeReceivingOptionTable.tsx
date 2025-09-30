"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Pencil, Trash2, Layers, Plus } from "lucide-react";
import IncomeReceivingOption from "./IncomeReceivingOptionAddFrom";
import RefreshButton from "@/components/utils/RefreshButton";

interface IncomeReceivingOption {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface IncomeReceivingOptionResponse {
  code: number;
  message: string;
  status: string;
  data: IncomeReceivingOption[];
}

interface Props {
  income_receiving_options: IncomeReceivingOptionResponse;
}

export default function IncomeReceivingOptionTable({
  income_receiving_options,
}: Props) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addFormOpen, setAddFormOpen] = useState(false);

  const formatBDTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      {/* Header with + button */}
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row items-center gap-2">
          <Layers className="h-6 w-6 opacity-75" />
          <CardTitle className="text-xl font-bold opacity-75">
            All Income Receiving Options
          </CardTitle>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setAddFormOpen(true)}>
            <Plus className="h-5 w-5 font-bold " />
            Add
          </Button>
          <RefreshButton />
        </div>
      </CardHeader>

      <CardContent>
        <Table className="w-full text-sm">
          <TableHeader className="">
            <TableRow className=" font-extrabold text-sm">
              <TableHead className="w-10">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Is Active</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {income_receiving_options?.data?.map((option) => (
              <TableRow
                key={option.id}
                className="hover:bg-indigo-50 transition-all duration-200"
              >
                <TableCell className="font-medium">
                  {option.id}
                </TableCell>
                <TableCell className="font-semibold">
                  {option.name}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      option.is_active
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {option.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {formatBDTime(option.created_at)}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {formatBDTime(option.updated_at)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className=""
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditModalOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Add Income Particular Form Modal */}
      {addFormOpen && (
        <IncomeReceivingOption
          open={addFormOpen}
          onClose={() => setAddFormOpen(false)}
        />
      )}
    </Card>
  );
}
