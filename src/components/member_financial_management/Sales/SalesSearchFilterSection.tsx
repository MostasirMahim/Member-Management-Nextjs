"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface Props {
  filterOptions: {
    sale_source_types: string[];
    customers: string[];
    statuses: string[];
  };
}

export function SalesSearchFilterSection({ filterOptions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [customer, setCustomer] = useState(searchParams.get("customer") || "");
  const [type, setType] = useState(searchParams.get("sale_source_type") || "all");
  const [status, setStatus] = useState(searchParams.get("payment_status") || "all");

  const handleSearch = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (customer) params.set("customer", customer);
    else params.delete("customer");

    if (type !== "all") params.set("sale_source_type", type);
    else params.delete("sale_source_type");

    if (status !== "all") params.set("payment_status", status);
    else params.delete("payment_status");

    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    handleSearch();
  }, [customer, type, status]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Input
        placeholder="Search by Customer"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        className="w-full sm:w-48"
      />

      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {filterOptions.sale_source_types.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {filterOptions.statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      
    </div>
  );
}
