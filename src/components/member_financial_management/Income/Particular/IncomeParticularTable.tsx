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
import AddIncomeParticular from "./IncomeParticularAddForm";

interface IncomeParticular {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface IncomeParticularResponse {
  code: number;
  message: string;
  status: string;
  data: IncomeParticular[];
}

interface Props {
  income_particulars: IncomeParticularResponse;
}

export default function IncomeParticularTable({ income_particulars }: Props) {
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
    <div>
      {/* Header with + button */}
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row items-center gap-2">
          <Layers className="h-6 w-6 opacity-75" />
          <CardTitle className="text-xl font-bold opacity-75">
            All Income Particulars
          </CardTitle>
        </div>

        {/* Plus button */}
        <Button
          variant="outline"
          size="lg"
          className="flex shadow-md items-center gap-1 text-indigo-600 hover:bg-indigo-50"
          onClick={() => setAddFormOpen(true)}
        >
          <Plus className="h-5 w-5 font-bold " />
          Add
        </Button>
      </CardHeader>

      <CardContent>
        <Table className="w-full text-sm text-gray-700">
          <TableHeader className="bg-gray-100">
            <TableRow className="bg-gray-100 font-extrabold text-sm">
              <TableHead className="w-10 text-gray-600">ID</TableHead>
              <TableHead className="text-gray-600">Name</TableHead>
              <TableHead className="text-gray-600">Is Active</TableHead>
              <TableHead className="text-gray-600">Created At</TableHead>
              <TableHead className="text-gray-600">Updated At</TableHead>
              <TableHead className="text-right text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {income_particulars?.data?.map((particular) => (
              <TableRow
                key={particular.id}
                className="hover:bg-indigo-50 transition-all duration-200"
              >
                <TableCell className="font-medium text-gray-700">
                  {particular.id}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {particular.name}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      particular.is_active
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {particular.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {formatBDTime(particular.created_at)}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {formatBDTime(particular.updated_at)}
                </TableCell>
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
                      <DropdownMenuItem
                        onClick={() => {
                          setEditModalOpen(true);
                        }}
                        className="text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600 hover:bg-red-100 cursor-pointer"
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
        <AddIncomeParticular open={addFormOpen} onClose={() => setAddFormOpen(false)} />
      )}
    </div>
  );
}
