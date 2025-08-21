"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, RefreshCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FilterOptions {
  invoice_types: string[];
  members: string[];
  statuses: string[];
}

interface Props {
  filterOptions: FilterOptions;
}

export function InvoiceSearchFilterSection({ filterOptions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("member") || "");
  const [selectedType, setSelectedType] = useState(searchParams.get("invoice_type") || "all");
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status") || "all");
  const [isFullPaid, setIsFullPaid] = useState(searchParams.get("is_full_paid") || "all");

  // Auto-update URL params
  const updateURLParams = (
    memberVal = searchQuery,
    typeVal = selectedType,
    statusVal = selectedStatus,
    fullPaidVal = isFullPaid
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (memberVal) params.set("member", memberVal);
    else params.delete("member");

    if (typeVal !== "all") params.set("invoice_type", typeVal);
    else params.delete("invoice_type");

    if (statusVal !== "all") params.set("status", statusVal);
    else params.delete("status");

    if (fullPaidVal !== "all") params.set("is_full_paid", fullPaidVal);
    else params.delete("is_full_paid");

    router.push(`?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedStatus("all");
    setIsFullPaid("all");
    router.push(`?page=1`);
  };

  return (
    <div className="flex flex-col sm:flex-wrap gap-4">
      <div className="flex-1 flex gap-2">
        {/* Member Search */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search member..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateURLParams(e.target.value, selectedType, selectedStatus, isFullPaid);
            }}
          />
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[220px]">
            <DropdownMenuLabel>Filter Invoices</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Invoice Type */}
            <div className="p-2">
              <Label htmlFor="invoice-type-filter" className="text-xs">Invoice Type</Label>
              <Select
                value={selectedType}
                onValueChange={(val) => {
                  setSelectedType(val);
                  updateURLParams(searchQuery, val, selectedStatus, isFullPaid);
                }}
              >
                <SelectTrigger id="invoice-type-filter">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {filterOptions.invoice_types.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="p-2">
              <Label htmlFor="status-filter" className="text-xs">Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(val) => {
                  setSelectedStatus(val);
                  updateURLParams(searchQuery, selectedType, val, isFullPaid);
                }}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {filterOptions.statuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Full Paid */}
            <div className="p-2">
              <Label htmlFor="is-full-paid-filter" className="text-xs">Full Paid</Label>
              <Select
                value={isFullPaid}
                onValueChange={(val) => {
                  setIsFullPaid(val);
                  updateURLParams(searchQuery, selectedType, selectedStatus, val);
                }}
              >
                <SelectTrigger id="is-full-paid-filter">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleResetFilters}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Reset Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
