"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface Props {
  filterOptions: {
    members: string[];
    received_by: string[];
    receiving_types: string[];
  };
}

export function IncomeSearchFilterSection({ filterOptions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [member, setMember] = useState(searchParams.get("member") || "");
  const [receivedBy, setReceivedBy] = useState(searchParams.get("received_by") || "all");
  const [receivingType, setReceivingType] = useState(searchParams.get("receiving_type") || "all");

  const handleSearch = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (member) params.set("member", member);
    else params.delete("member");

    if (receivedBy !== "all") params.set("received_by", receivedBy);
    else params.delete("received_by");

    if (receivingType !== "all") params.set("receiving_type", receivingType);
    else params.delete("receiving_type");

    // Reset page to 1 on filter change
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member, receivedBy, receivingType]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mb-4">
      <Input
        placeholder="Search by Member"
        value={member}
        onChange={(e) => setMember(e.target.value)}
        className="w-full sm:w-48"
      />

      <Select value={receivedBy} onValueChange={setReceivedBy}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Received By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Received By</SelectItem>
          {filterOptions.received_by.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={receivingType} onValueChange={setReceivingType}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Receiving Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {filterOptions.receiving_types.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
