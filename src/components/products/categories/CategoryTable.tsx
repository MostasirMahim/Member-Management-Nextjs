"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { MoreVertical } from "lucide-react";
import { Layers } from "lucide-react";
import { useState } from "react";
import { Plus } from "lucide-react";


interface Category {
  id: number;
  name: string;
}

interface CategoryResponse {
  code: number;
  message: string;
  status: string;
  data: Category[];
}

interface Props {
  categories: CategoryResponse;
}

export default function CategoryTable({ categories }: Props) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (

   
    <Card className="shadow-md border rounded-2xl bg-white">

      
      <CardHeader className="flex flex-row items-center gap-2">
        <Layers className="text-indigo-600 h-6 w-6" />
        <CardTitle className="text-xl font-bold text-indigo-600">
          All Product Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full text-sm text-gray-700">
          <TableHeader className="bg-gray-100">
            <TableRow className="bg-gray-100 font-bold text-sm">
              <TableHead className="w-10 text-gray-500 ">Id</TableHead>
              <TableHead className="text-gray-600">Category Name</TableHead>
              <TableHead className="text-right text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.data.map((cat, index) => (
              <TableRow
                key={cat.id}
                className="hover:bg-indigo-50 transition-all duration-200"
              >
                <TableCell className="font-medium text-gray-700">
                  {index + 1}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {cat.name}
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
                      <DropdownMenuItem className="text-indigo-600 hover:bg-indigo-100">
                        ✏️ Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 hover:bg-red-100">
                        🗑️ Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
