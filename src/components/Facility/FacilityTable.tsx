"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SmartPagination } from "../utils/SmartPagination";
import { DollarSign } from "lucide-react";

interface Facility {
  id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  name: string;
  description: string;
  usages_fee: string;
  usages_roles: string;
  operating_hours: string;
  status: string;
  capacity: number;
}

interface FacilitiesTableProps {
  data: Facility[];
  pagination: any;
}

export function FacilitiesTable({ data, pagination }: FacilitiesTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "success";
      case "closed":
        return "destructive";
      case "maintenance":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getActiveVariant = (isActive: boolean): "success" | "destructive" => {
    return isActive ? "success" : "destructive";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Club Facilities</CardTitle>
        <CardDescription>
          Manage and view all club facilities and their details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[120px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Usage Fee</TableHead>
                <TableHead>Allowed Roles</TableHead>
                <TableHead>Operating Hours</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((facility) => (
                <TableRow key={facility.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium bg-muted/20">
                    #{facility.id}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {facility.name}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {facility.description}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-xl bg-primary/5">
                    <span className="flex items-center gap-1">
                      <DollarSign /> {facility.usages_fee}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {facility.usages_roles}
                    </Badge>
                  </TableCell>
                  <TableCell className="bg-muted/20">
                    {facility.operating_hours}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{facility.capacity}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="capitalize">{facility.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{facility.is_active ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground bg-muted/10">
                    {formatDate(facility.updated_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No facilities found
          </div>
        )}
        <SmartPagination paginationData={pagination} />
      </CardContent>
    </Card>
  );
}
