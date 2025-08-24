"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, CheckCircle2, XCircle } from "lucide-react";

interface Income {
  id: number;
  particular: string;
  received_from_type: string;
  receiving_type: string;
  member: string;
  received_by: string;
  sale: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  date: string;
  receivable_amount: string;
  discount_name: string;
  discounted_amount: string;
  final_receivable: string;
  actual_received: string;
  reaming_due: string;
  due_payable_last_date: string | null;
}

interface Props {
  income: Income;
}

export default function IncomeDetails({ income }: Props) {
  const formatBDDate = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-6">
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-t-2xl flex flex-row items-center gap-3 py-6 px-4">
          <Info className="h-8 w-8 text-white drop-shadow" />
          <CardTitle className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Income Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 py-8 px-4 md:px-8">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/80 rounded-xl shadow p-6">
            <div className="flex flex-col gap-3">
              <div>
                <span className="font-semibold text-indigo-700">Particular:</span>{" "}
                <span className="text-gray-800">{income.particular}</span>
              </div>
              <div>
                <span className="font-semibold text-indigo-700">Member:</span>{" "}
                <span className="text-gray-800">{income.member}</span>
              </div>
              <div>
                <span className="font-semibold text-indigo-700">Received By:</span>{" "}
                <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-300">
                  {income.received_by}
                </Badge>
              </div>
              <div>
                <span className="font-semibold text-indigo-700">Receiving Type:</span>{" "}
                <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
                  {income.receiving_type}
                </Badge>
              </div>
              <div>
                <span className="font-semibold text-indigo-700">Sale:</span>{" "}
                <span className="text-gray-800">{income.sale}</span>
              </div>
              <div>
                <span className="font-semibold text-indigo-700">Received From Type:</span>{" "}
                <span className="text-gray-800">{income.received_from_type}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <span className="font-semibold text-indigo-700">Date:</span>{" "}
                <span className="text-gray-800">{formatBDDate(income.date)}</span>
              </div>
              <div>
                <span className="font-semibold text-indigo-700">Created At:</span>{" "}
                <span className="text-gray-800">{formatBDDate(income.created_at)}</span>
              </div>
              <div>
                <span className="font-semibold text-indigo-700">Updated At:</span>{" "}
                <span className="text-gray-800">{formatBDDate(income.updated_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-indigo-700">Is Active:</span>
                {income.is_active ? (
                  <Badge className="bg-green-100 text-green-700 border border-green-300 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Active
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-700 border border-red-300 flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> Inactive
                  </Badge>
                )}
              </div>
              <div>
                <span className="font-semibold text-indigo-700">Due Payable Last Date:</span>{" "}
                <span className="text-gray-800">
                  {income.due_payable_last_date ? formatBDDate(income.due_payable_last_date) : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
              <Info className="h-5 w-5" /> Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
              <div className="flex flex-col gap-1 bg-indigo-50 rounded-lg p-4 shadow-sm">
                <span className="text-sm text-indigo-700 font-semibold">Receivable Amount</span>
                <span className="text-lg font-bold">{income.receivable_amount}</span>
              </div>
              <div className="flex flex-col gap-1 bg-blue-50 rounded-lg p-4 shadow-sm">
                <span className="text-sm text-blue-700 font-semibold">Discount Name</span>
                <span className="text-lg font-bold">{income.discount_name || "-"}</span>
              </div>
              <div className="flex flex-col gap-1 bg-green-50 rounded-lg p-4 shadow-sm">
                <span className="text-sm text-green-700 font-semibold">Discounted Amount</span>
                <span className="text-lg font-bold">{income.discounted_amount}</span>
              </div>
              <div className="flex flex-col gap-1 bg-yellow-50 rounded-lg p-4 shadow-sm">
                <span className="text-sm text-yellow-700 font-semibold">Final Receivable</span>
                <span className="text-lg font-bold">{income.final_receivable}</span>
              </div>
              <div className="flex flex-col gap-1 bg-teal-50 rounded-lg p-4 shadow-sm">
                <span className="text-sm text-teal-700 font-semibold">Actual Received</span>
                <span className="text-lg font-bold">{income.actual_received}</span>
              </div>
              <div className="flex flex-col gap-1 bg-pink-50 rounded-lg p-4 shadow-sm">
                <span className="text-sm text-pink-700 font-semibold">Remaining Due</span>
                <span className="text-lg font-bold">{income.reaming_due}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
