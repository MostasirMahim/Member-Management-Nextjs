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
import {
  DollarSign,
  MoreVertical,
  Pencil,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { useFacilityCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import RefreshButton from "../utils/RefreshButton";

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
  const router = useRouter();
  const setFacility = useFacilityCartStore((state) => state.setFacility);

  const handleBuyFacility = (id: number) => {
    const facility = data.find((facility) => facility.id === id);
    if (facility) {
      setFacility(facility);
      router.push("/facilities/buy");
    } else {
      toast.error("Facility not found");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <CardTitle>Club Facilities</CardTitle>
          <CardDescription>
          Manage and view all club facilities and their details
        </CardDescription>
        </div>
        <RefreshButton/>
        
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
                  <TableCell
                    className="
                  "
                  >
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
                          onClick={() => handleBuyFacility(facility.id)}
                          className="text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" /> Buy
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
