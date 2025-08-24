"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface Props {
  filterOptions: {
    members: string[];
    payment_methods: string[];
    statuses: string[];
  };
}

export function PaymentSearchFilterSection({ filterOptions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log("useSearchParams:", searchParams);

  const [member, setMember] = useState(searchParams.get("member") || "");
  const [paymentMethod, setPaymentMethod] = useState(searchParams.get("payment_method") || "all");
  const [status, setStatus] = useState(searchParams.get("payment_status") || "all");

  const handleSearch = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (member) params.set("member", member);
    else params.delete("member");

    if (paymentMethod !== "all") params.set("payment_method", paymentMethod);
    else params.delete("payment_method");

    if (status !== "all") params.set("payment_status", status);
    else params.delete("payment_status");

    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    handleSearch();
  }, [member, paymentMethod, status]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Input
        placeholder="Search by Member"
        value={member}
        onChange={(e) => setMember(e.target.value)}
        className="w-full sm:w-48"
      />

      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Payment Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Methods</SelectItem>
          {filterOptions.payment_methods.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
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
